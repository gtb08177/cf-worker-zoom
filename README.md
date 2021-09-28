# Zoom Status Monitor via Cloudflare Workers
This project consists of a single Javascript file that can be deployed as a [Cloudflare Worker](https://workers.cloudflare.com/) to allow [Zoom](https://zoom.us/) to push notifications about a particular user's in call / meeting status, that can then subsequently be consumed via a simple GET request.

The motivation for this project was to create an "on-air" style light built around a [Raspberry Pi Zero](https://www.raspberrypi.org/products/raspberry-pi-zero/) that would change colour dependent on if the user is currently on a call, scheduled to be in a meeting or free. 

A simple cron job polls this Cloudflare Worker every 60 seconds and subject to a change in value from the previous known value, will change the colour accordingly.

Images of the end result can be seen in `/img`.

# Additional Setup
In order to support this worker - you will require a KV keyspace and and an environment variable named `shared_secret` which you will recieve from Zoom to ensure the notification of Zoom status is legitimate and not a bad actor. Once you have named your KV keyspace, you can update the `.js` file to reflect your naming convention.