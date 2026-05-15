import express from "express";
import { grpc, userProto } from "./shared/grpc.js";

const app = express();
app.use(express.json());

const client = new userProto.UserService(
    "localhost:50051",
    grpc.credentials.createInsecure()
) as {
    CreateUser: (
        request: { name: string; email: string },
        callback: (error: grpc.ServiceError | null, response: any) => void
    ) => void;
    GetUser: (
        request: { id: string },
        callback: (error: grpc.ServiceError | null, response: any) => void
    ) => void;
    ListUsers: (
        request: Record<string, never>,
        callback: (error: grpc.ServiceError | null, response: any) => void
    ) => void;
};

function grpcToHttpStatus(error: grpc.ServiceError) {
    switch (error.code) {
        case grpc.status.INVALID_ARGUMENT:
            return 400;
        case grpc.status.NOT_FOUND:
            return 404;
        default:
            return 500;
    }
}

app.post("/users", (req, res) => {
    const { name, email } = req.body;

    client.CreateUser({ name, email }, (error, response) => {
        if (error) {
            res.status(grpcToHttpStatus(error)).json({
                error: error.message
            });
            return;
        }

        res.status(201).json(response);
    });
});

app.get("/users/:id", (req, res) => {
    client.GetUser({ id: req.params.id }, (error, response) => {
        if (error) {
            res.status(grpcToHttpStatus(error)).json({
                error: error.message
            });
            return;
        }

        res.json(response);
    });
});

app.get("/users", (_req, res) => {
    client.ListUsers({}, (error, response) => {
        if (error) {
            res.status(grpcToHttpStatus(error)).json({
                error: error.message
            });
            return;
        }

        res.json(response.users);
    });
});

app.listen(3000, () => {
    console.log("api-server listening on http://localhost:3000");
});