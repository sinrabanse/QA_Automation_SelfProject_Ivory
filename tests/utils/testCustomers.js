import { getCustomerFieldByDescription } from "./moduleDB.js";

export const testStandardCustomer = {
  ...(await getCustomerFieldByDescription("standard_user", [
    "name",
    "email",
    "phone",
    "city",
    "street",
    "home_number",
    "personal_id",
    "card_number",
    "exp_year",
    "exp_month",
    "cvv",
  ])),
};

export const testErrorCustomer = {
  ...(await getCustomerFieldByDescription("error_user", [
    "name",
    "email",
    "phone",
    "city",
    "street",
    "home_number",
    "personal_id",
    "card_number",
    "exp_year",
    "exp_month",
    "cvv",
  ])),
};
