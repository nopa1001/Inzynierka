'use strict';

/**
 * vacation service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vacation.vacation');
