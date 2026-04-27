import { parse, type DocumentNode, visit, Kind } from 'graphql';

type CostConfig = {
    defaultFieldCost: number;
    maxLimitArg: number;
};

const DEFAULTS: CostConfig = {
    defaultFieldCost: 1,
    maxLimitArg: 50
};

/**
 * Very small “cost analyzer”.
 * - Every field contributes defaultFieldCost
 * - searchBooks cost scales with `limit` (1..maxLimitArg)
 * - heavyStats scales with `iterations` (capped)
 *
 * This is not a full GraphQL complexity implementation; it's a practice version.
 */
export function calculateQueryCost(query: string, variables: Record<string, unknown> | null | undefined, cfg?: Partial<CostConfig>) {
    const config: CostConfig = { ...DEFAULTS, ...cfg };
    const doc: DocumentNode = parse(query);

    let cost = 0;

    // helper to read argument value (supports Int literals + variable refs)
    function readIntArg(argNode: any):number | null {
        if (!argNode) return null;
        
        if (argNode.value.kind === Kind.INT) return Number(argNode.value.value);

        if (argNode.value.kind === Kind.VARIABLE) {
            const varName = argNode.value.name.value;
            const v = variables?.[varName];
            if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v);
            if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Math.trunc(Number(v));
            return null;
        }

        return null;
    }

    visit(doc, {
        Field(node) {
            cost += config.defaultFieldCost;

            const fieldName = node.name.value;

            if (fieldName === 'searchBooks') {
                const limitArg = node.arguments?.find(a => a.name.value === 'limit');
                const limit = readIntArg(limitArg) ?? 5;
                const normalized = Math.max(1, Math.min(config.maxLimitArg, limit));
                cost += normalized; // add extra cost proportional to returned items
            }
        }
    })
}