'use client';
import mqtt from "mqtt";
import { createContext, FC, ReactNode, useEffect, useRef, useState } from "react";

export const MqttContext = createContext<mqtt.MqttClient | null>(null);

export const MqttProvider = ({ children } : { children: ReactNode }) => {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    const currentClient = mqtt.connect("ws://localhost:9000");
    currentClient.on('connect', () => {
      console.log('Cliente conectado al broker MQTT');

      // Suscribirse a un tema
      currentClient.subscribe('test/topic', (err) => {
          if (!err) {
              console.log('Suscripción exitosa');
          } else {
              console.error('Error al suscribir:', err);
          }
      });

      // Publicar un mensaje
      currentClient.publish('test/topic', 'Hola desde el cliente MQTT!');
    });
    setClient(currentClient);
  }, []);
  return (
    <MqttContext.Provider value={client}>
        {children}
    </MqttContext.Provider>
  )
}

