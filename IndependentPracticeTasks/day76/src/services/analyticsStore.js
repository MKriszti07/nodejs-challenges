import dayjs from "dayjs";

/**
 * In-memory event store:
 * {
 *   id: string,
 *   eventType: string,
 *   userId: string,
 *   timestamp: number (ms),
 *   metadata: object
 * }
 */
const events = [];

function createEventId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function addEvent(payload) {
    const event = {
        id: createEventId(),
        eventType: payload.eventType,
        userId: payload.userId,
        timestamp: payload.timestamp ? dayjs(payload.timestamp).valueOf() : Date.now(),
        metadata: payload.metadata ?? {}
    };

    events.push(event);
    return event;
}

export function pruneOldEvents(maxAgeMs) {
    const cutoff = Date.now() - maxAgeMs;
    // mutate in place to preserve reference
    let writeIndex = 0;
    for (let readIndex = 0; readIndex < events.length; readIndex ++) {
        if (events[readIndex].timestamp >= cutoff) {
            events[writeIndex++] = events[readIndex];
        }
    }
    events.length = writeIndex;
}

function countByEventType(eventList) {
    const map = new Map();

    for (const event of eventList) {
        map.set(event.eventType, (map.get(event.eventType) ?? 0) + 1);
    }

    return Object.fromEntries(map);
}

function topEventTypes(eventList, limit = 5) {
    const counts = countByEventType(eventList);

    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([eventType, count]) => ({ eventType, count }));
}

function uniqueUsers(eventList) {
    const users = new Set(eventList.map((e) => e.userId));
    return users.size;
}

export function getSnapshot(windowMs = 60_000) {
    const now = Date.now();
    const cutOff = now - windowMs;

    const recentEvents = events.filter((e) => e.timestamp >= cutoff);
    const totalEvents = events.length;

    return {
        generatedAt: new Date(now).toISOString(),
        windowMs,
        totals: {
            events: totalEvents,
            users: uniqueUsers(events)
        },
        lastWindow: {
            events: recentEvents.length,
            users: uniqueUsers(recentEvents),
            eventTypeCounts: countByEventType(recentEvents),
            topEventTypes: topEventTypes(recentEvents, 5)
        }
    };
}