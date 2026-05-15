import { randomUUID } from "node:crypto";
import { grpc, userProto, GRPC_ADDRESS } from "./shared/grpc.js";

type User = {
    id: string;
    name: string;
    email: string;
};

const users = new Map<string, User>();

function validateUserInput(name?:string, email?:string) {
    if (!name || !email) {
        return "name and email are required";
    }

    if (!email.includes("@")) {
        return "email must be valid";
    }

    return null;
}

function createUser(
    call: grpc.ServerUnaryCall<{ name: string; email: string }, User>,
    callback: grpc.sendUnaryData<User>
) {
    const { name, email } = call.request;

    const validationError = validateUserInput(name, email);
    if (validationError) {
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: validationError,
            name: "INVALID_ARGUMENT"
        });
        return;
    }

    const user: User = {
        id: randomUUID(),
        name,
        email
    };

    users.set(user.id, user);
    callback(null, user);
}

function getUser(
    call: grpc.ServerUnaryCall<{ id: string }, User>,
    callback: grpc.sendUnaryData<User>
) {
    const user = users.get(call.request.id);

    if (!user) {
        callback({
            code: grpc.status.NOT_FOUND,
            message: "user not found",
            name: "NOT_FOUND"
        });
        return;
    }

    callback(null, user);
}

function listUsers(
    _call: grpc.ServerUnaryCall<Record<string, never>, { users: User[] }>,
    callback: grpc.sendUnaryData<{ users: User[] }>
) {
    callback(null, { users: [...users.values()] });
}

function main() {
    const server = new grpc.Server();

    server.addService(userProto.UserService.service, {
        CreateUser: createUser,
        GetUser: getUser,
        ListUsers: listUsers
    });

    server.bindAsync(
        GRPC_ADDRESS,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            if (error) {
                console.error("Failed to start gRPC server:", error);
                process.exit(1);
            }

            console.log(`user-service gRPC server running on ${GRPC_ADDRESS} (port ${port})`);
        }
    );
}

main();