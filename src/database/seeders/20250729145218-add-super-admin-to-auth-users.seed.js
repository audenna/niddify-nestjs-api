'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const adminFirstName = process.env.SUPER_ADMIN_FIRST_NAME;
    const adminLastName = process.env.SUPER_ADMIN_LAST_NAME;
    const adminEmail = process.env.SUPER_ADMIN_EMAIL_ADDRESS;
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const salt = await bcrypt.genSalt(Number(process.env.SALT_OR_ROUNDS));

    const date = new Date();
    const count = await queryInterface.rawSelect(
      'auth_users',
      {
        where: { emailAddress: adminEmail.toLowerCase() },
      },
      ['id'],
    );

    if (count) return;

    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await queryInterface.bulkInsert('auth_users', [
      {
        uuid: uuidv4(),
        userType: 'niddify_admin',
        username: adminEmail.toLowerCase(),
        emailAddress: adminEmail.toLowerCase(),
        firstName: adminFirstName,
        lastName: adminLastName,
        passwordHash: hashedPassword,
        hasVerifiedOTP: true,
        presenceStatus: 'active',
        createdAt: date,
        updatedAt: date,
      },
    ]);

    const authUserId = await queryInterface.rawSelect(
      'auth_users',
      {
        where: { emailAddress: adminEmail.toLowerCase() },
      },
      ['id'],
    );

    await queryInterface.bulkInsert('admins', [
      {
        uuid: uuidv4(),
        authUserId,
        createdAt: date,
        updatedAt: date,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL_ADDRESS;
    await queryInterface.bulkDelete('auth_users', {
      emailAddress: adminEmail.toLowerCase(),
    });
  }
};
