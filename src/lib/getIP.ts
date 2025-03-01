import axios from "axios";

/**
 * Fetches the user's public IP and emits a socket event to join the network.
 * @param setPubIp Function to update public IP in store
 * @param socket Socket instance from `useSocketStore`
 */
export function getIp(setPubIp: (ip: string) => void) {
  axios
    .get<{ ip: string }>("https://ipinfo.io/json")
    .then((response) => {
      const pubIp = response.data.ip;
      setPubIp(pubIp);
    })
    .catch((error) => {
      console.error("Error fetching IP:", error);
    });
}
