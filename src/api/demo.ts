import { apiRequest } from "./client";

type DemoLoginRequest = {
  username: string;
  password: string;
};

type DemoAccount = {
  dataSource: "demo";
  accountId: string;
  name: string;
  awsAccountId: string;
  region: string;
};

export function loginDemo(input: DemoLoginRequest) {
  return apiRequest<DemoAccount>("/demo/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
