import { grpc, userProto } from "./shared/grpc.js";

const client = new userProto.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure(),
) as {
  CreateUser: (
    request: { name: string; email: string },
    callback: (error: grpc.ServiceError | null, response: any) => void,
  ) => void;
};

const demoUsers = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

for (const user of demoUsers) {
    client.CreateUser(user, (error, response) => {
        if (error) {
            console.error("Seed error:", error.message);
            return;
        }

        console.log("Created:", response);
    });
}
