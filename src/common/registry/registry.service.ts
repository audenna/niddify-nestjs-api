import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

/**
 * Generic service registry for pluggable components.
 *
 * Usage:
 * Extend this class in a service-specific registry like `PaymentRegistryService`
 * and provide the appropriate metadata key and interface check.
 *
 * Example:
 * @Injectable()
 * export class PaymentRegistryService extends RegistryService<IPaymentProvider> {
 *   constructor(
 *     discoveryService: DiscoveryService,
 *     reflector: Reflector,
 *   ) {
 *     super(discoveryService, reflector, PAYMENT_PROVIDER, (instance): instance is IPaymentProvider =>
 *       typeof instance.processWebhookPayload === 'function' && instance.isEnabled === true
 *     );
 *   }
 * }
 */
@Injectable()
export abstract class RegistryService<T> implements OnModuleInit {
  private readonly logger = new Logger(RegistryService.name);

  private readonly providers = new Map<string, T>();

  protected constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataKey: string, // e.g. PAYMENT_PROVIDER
    private readonly interfaceCheck?: (instance: any) => instance is T, // Optional guard
  ) {}

  onModuleInit(): void {
    const discoveredProviders = this.discoveryService.getProviders();

    for (const wrapper of discoveredProviders) {
      const instance = wrapper?.instance as T;

      if (!instance) continue;

      const name = this.reflector.get<string>(
        this.metadataKey,
        instance.constructor,
      );

      if (!name) continue;

      // Optional type guard (e.g. check for specific methods)
      if (this.interfaceCheck && !this.interfaceCheck(instance)) continue;

      this.logger.log(`Registering provider "${name}"`);
      this.providers.set(name, instance as T);
    }

    this.logger.log(
      `Registry initialized with ${this.providers.size} provider(s).`,
    );
  }

  public getProvider(name?: string): T {
    // If a name is given, return the specific provider
    if (name) {
      this.logger.log(`Searching for registry provider: "${name}"`);
      const provider = this.providers.get(name);
      this.logger.log(`Found registry provider`);

      if (!provider) {
        this.logger.error(`Registry provider "${name}" not found`);
        throw new Error(`Provider '${name}' not found`);
      }

      return provider;
    }

    // Otherwise, select the first active or available provider
    for (const [key, instance] of this.providers.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const active = (instance as any)?.isEnabled ?? true; // assumes default true if no flag
      if (active) {
        this.logger.log(`Auto-selected active provider "${key}"`);
        return instance;
      }
    }

    this.logger.error('No active provider found in registry');
    throw new Error('No active provider available');
  }

  public getAll(): Map<string, T> {
    return this.providers;
  }
}
