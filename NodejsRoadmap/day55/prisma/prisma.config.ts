import { defineConfig } from "prisma/config";

export default defineConfig({
    // Used by Prisma Migrate (and other CLI commands)
    datasource: {
        url: 'file:./prisma/dev.db'
    }
});