// EXAMPLE POST PAYLOAD
// {
//     "event": "user.presence_status_updated",
//         "event_ts": 1234566789900,
//             "payload": {
//         "account_id": "EPjfyjxHMA",
//             "object": {
//             "date_time": "2026",
//                 "email": "sfdhfghfgh@dkjdfd.com",
//                     "id": "z8ycx1223fq",
//                         "presence_status": "Available"
//         }
//     }
// }

addEventListener("fetch", event => {
    try {
        const request = event.request
        if (request.method.toUpperCase() === "POST")
            return event.respondWith(handlePostRequest(event))
        return event.respondWith(handleRequest(event))
    } catch (e) {
        return event.respondWith(new Response("Error thrown " + e.message))
    }
})

async function handlePostRequest(event) {
    const auth_token = event.request.headers.get("Authorization")

    // Invalid auth token - reject it
    if (auth_token == null || auth_token != shared_secret) {
        const json = JSON.stringify({ reason: "Unauthorised" }, null, 2)
        return new Response(json, {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            },
            status: 403
        })
    }


    const payload = (await event.request.json()).payload.object;
    const timestamp = payload.date_time;
    const status = payload.presence_status;

    // Invalid payload - reject it
    if (!timestamp || !status) {
        const json = JSON.stringify({ reason: "Invalid payload provided" }, null, 2)
        return new Response(json, {
            status: 400, headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        })
    }

    // Possible values: Available, Away, Do_Not_Disturb, In_Meeting, Presenting, On_Phone_Call, In_Calendar_Event
    // URL: https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/presence-status-updated
    var in_meeting;

    switch (status) {
        case "In_Meeting":
            in_meeting = true
            break;
        case "Presenting":
            in_meeting = true
            break;
        default:
            in_meeting = false
    }

    await ZoomMonitor_Keyspace.put("in_meeting", in_meeting);
    await ZoomMonitor_Keyspace.put("last_update", timestamp);

    return new Response("Successful processed.", { status: 200 });
}

async function handleRequest(request) {
    const status = await ZoomMonitor_Keyspace.get("in_meeting")
    const last_update = await ZoomMonitor_Keyspace.get("last_update")

    if (status === null) {
        return new Response("Value not found", { status: 404 })
    } else {
        const json = JSON.stringify({ in_meeting: status, last_update: last_update }, null, 2)
        return new Response(json, {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        })
    }
}