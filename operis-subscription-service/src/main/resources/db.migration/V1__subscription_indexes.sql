-- V1__subscription_indexes.sql
CREATE UNIQUE INDEX ux_active_subscription_per_user
    ON subscriptions (user_id) WHERE active = true;