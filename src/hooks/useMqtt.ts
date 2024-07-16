import { MqttContext } from "@/contexts/mqtt";
import { useContext, useEffect, useCallback } from "react"

export const useMqtt = () => {
  const client = useContext(MqttContext);

  const publish = useCallback((topic: string, message: string) => {
    if (client) {
      client.publish(topic, message);
      console.log('Message published:', message);
    } else {
      console.error('MQTT client is not available');
    }
  }, [client]);

  const subscribe = useCallback((topic: string, callback: (message: string) => void) => {
    if (!client) {
      console.error('MQTT client is not available');
      return;
    }

    const handler = (_topic: string, payload: Buffer) => {
      if (_topic === topic) {
        console.log('Message received on topic:', topic);
        callback(payload.toString());
      }
    };

    client.subscribe(topic, (err) => {
      if (!err) {
        client.on('message', handler);
        console.log('Subscribed to:', topic);
      } else {
        console.error('Failed to subscribe:', err);
      }
    });

    return () => {
      client.unsubscribe(topic, (err) => {
        if (!err) {
          client.removeListener('message', handler);
          console.log('Unsubscribed from:', topic);
        } else {
          console.error('Failed to unsubscribe:', err);
        }
      });
    };
  }, [client]);

  return { publish, subscribe };
};
