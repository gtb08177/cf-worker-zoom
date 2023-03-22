# Zoom Status Monitor via Cloudflare Workers

## Description 
This project consists of a single Javascript file that can be deployed as a [Cloudflare Worker](https://workers.cloudflare.com/) to allow [Zoom](https://zoom.us/) to push notifications about a particular user's in call / meeting status, that can then subsequently be consumed via a simple GET request.

The motivation for this project was to create an "on-air" style light built around a [Raspberry Pi Zero](https://www.raspberrypi.org/products/raspberry-pi-zero/) that would change colour dependent on if the user is currently on a call, scheduled to be in a meeting or free. 

A simple cron job polls this Cloudflare Worker every 60 seconds and subject to a change in value from the previous known value, will change the colour accordingly.

Images of the end result can be seen in `/img`.

<br/>

## Additional Setup
In order to support this worker - you will require a KV keyspace and and an environment variable named `shared_secret` which you will recieve from Zoom to ensure the notification of Zoom status is legitimate and not a bad actor. Once you have named your KV keyspace, you can update the `.js` file to reflect your naming convention.

<br/>

## v2 Implementation
The v2 implementation of this Cloudflare worker differs from the v1 implementation in the following way:
- Most notably, the configuration and deployment is managed via Terraform.
- Their are now dependencies (for Terraform) on environments variables specifically coupled to Cloudflare - [please see here for more details](https://https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs#optional).
- A different namespace has been used to allow a separation of concerns.

<br/>

## Demo
https://api.mcnulty.network/v2/zoom

---

## Legacy v1 Implementation
Please note that in the v1 implementation of this setup, these artifacts were configured manually in the Cloudflare console and merely checked in to Github as a means of version control.
Please opt for the Terraform deployed v2 implementation for easier maintenance.

<br/>

## Demo
https://api.mcnulty.network/v1/zoom