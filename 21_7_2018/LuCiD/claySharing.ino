#include <SimpleDHT.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

#include <WiFiManager.h>

#include <PubSubClient.h>
#define LED D4
// for DHT22, 
//      VCC: 5V or 3V
//      GND: GND
//      DATA: 2
int pinDHT22 = D2;
SimpleDHT22 dht22;

//#include <IRremoteESP8266.h>
//#include <IRsend.h>

//#define IR_LED 4  // GPIO the IR LED is connected to/controlled by. GPIO 4 = D2.
//IRsend irsend(IR_LED);  // Set the GPIO to be used to sending the message.

WiFiClient espClient;
WiFiManager wifiManager;

PubSubClient client(espClient);


const char* ssid = "IOT_C2C";
const char* password =  "info@c2c";
const char* mqttServer = "broker.chip2cloud.net";
const int mqttPort = 1883;
const char* mqttUser = "UstIOT";
const char* mqttPassword = "Pa$$w0rd$**$";
const char* publish_topic = "D2C/988";
const char* subscribe_topic = "C2D";

String mqtt_clientid = "CLAY" + String(ESP.getChipId(), HEX);
uint32_t lastReconnectAttempt = 0;
#define MQTT_RECONNECT_TIME 5000
bool boot = true;






void setup_wifi() {
  pinMode(LED,OUTPUT);
  delay(10);
  // We start by connecting to a WiFi network

  wifiManager.setTimeout(300);  // Time out after 5 mins.
  if (!wifiManager.autoConnect()) {
    Serial.println("Wifi failed to connect and hit timeout.");
    delay(3000);
    // Reboot. A.k.a. "Have you tried turning it Off and On again?"
    ESP.reset();
    delay(5000);
  }

  Serial.println("WiFi connected. IP address: " + WiFi.localIP());
}


void setup() {
//    irsend.begin();
  Serial.begin(115200);

    setup_wifi();

  // Wait a bit for things to settle.
  delay(1500);

  lastReconnectAttempt = 0;



   client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
 

}

bool reconnect() {
  // Loop a few times or until we're reconnected
  uint16_t tries = 1;
  while (!client.connected() && tries <= 3) {
    int connected = false;
    // Attempt to connect
    Serial.println("Attempting MQTT connection to MQTT Server");
   connected = client.connect(mqtt_clientid.c_str(), mqttUser, mqttPassword);
       if (connected) {
    // Once connected, publish an announcement...
      //client.publish(MQTTack, "Connected");
        client.subscribe(subscribe_topic);

      Serial.println("Subsrcibing to MQTT.");
      // Subscribing to topic(s)
      //subscribing(MQTTcommand);
    } else {
      Serial.println("failed, rc=" + String(client.state()) +
            " Try again in a bit.");
      // Wait for a bit before retrying
      delay(tries << 7);  // Linear increasing back-off (x128)
    }
    tries++;
  }
  return client.connected();
}


void callback(char* topic, byte* payload, unsigned int length) {
 
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
 Serial.println((char)payload[11]);
 Serial.println((char)payload[40]);
  Serial.print("Message:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
 
  Serial.println();
  Serial.println("-----------------------");
  Serial.println((char)payload[11]);

   if (((char)payload[11] == '9') && ((char)payload[12] == '8') && ((char)payload[13] == '8') && ((char)payload[41] == '0'))          //deviceCode:956|values:{"Trans":1,"Data":0}
    {    
//  irsend.sendRaw(signalON, bitsize, 38);  // Send a raw data capture at 38kHz.
      client.publish("D2C/988","Publishing");
      Serial.println("send signal on");
      digitalWrite(LED,LOW);
   
    }
    else if (((char)payload[11] == '9') && ((char)payload[12] == '8') && ((char)payload[13] == '8') && ((char)payload[41] == '1'))        //deviceCode:956|values:{"Trans":1,"Data":1}
    {
      
// irsend.sendRaw(signalOFF, bitsize, 38);  // Send a raw data capture at 38kHz.

      Serial.println("send signal off");
      digitalWrite(LED,HIGH);

//      // start working...
//  Serial.println("=================================");
//  Serial.println("Sample DHT22...");
//  
//  // read without samples.
//  // @remark We use read2 to get a float data, such as 10.1*C
//  //    if user doesn't care about the accurate data, use read to get a byte data, such as 10*C.
//  float temperature = 0;
//  float humidity = 0;
//  int err = SimpleDHTErrSuccess;
//  if ((err = dht22.read2(pinDHT22, &temperature, &humidity, NULL)) != SimpleDHTErrSuccess) {
//    Serial.print("Read DHT22 failed, err="); Serial.println(err);delay(2000);
//    return;
//  }
//  
//  Serial.print("Sample OK: ");
//  Serial.print((float)temperature); Serial.print(" *C, ");
//  Serial.print((float)humidity); Serial.println(" RH%");
//  
//  // DHT22 sampling rate is 0.5HZ.
//  delay(2500);
//
//  //String json="deviceCode:988|values:{\"Trans\":1, \"Data\":\"Temp \| \'"+(String)temperature+"\',Humid \|\' "+(String)humidity+"\'\"}";
//  String json="deviceCode:988|values:{\"Trans\":1, \"Data\":\"Temp \| \'"+(String)temperature+"\'\"}";
//             char data[json.length()+1];
//             json.toCharArray(data,json.length()+1);
//             client.publish("D2C/988" , data);         
    }
  
}




void loop() {
         // start working...
  Serial.println("=================================");
  Serial.println("Sample DHT22...");
  
  // read without samples.
  // @remark We use read2 to get a float data, such as 10.1*C
  //    if user doesn't care about the accurate data, use read to get a byte data, such as 10*C.
  float temperature = 0;
  float humidity = 0;
  int err = SimpleDHTErrSuccess;
  if ((err = dht22.read2(pinDHT22, &temperature, &humidity, NULL)) != SimpleDHTErrSuccess) {
    Serial.print("Read DHT22 failed, err="); Serial.println(err);delay(2000);
    return;
  }
  
  Serial.print("Sample OK: ");
  Serial.print((float)temperature); Serial.print(" *C, ");
  Serial.print((float)humidity); Serial.println(" RH%");
  
  // DHT22 sampling rate is 0.5HZ.
  delay(2500);

  //String json="deviceCode:988|values:{\"Trans\":1, \"Data\":\"Temp \| \'"+(String)temperature+"\',Humid \|\' "+(String)humidity+"\'\"}";
  //String json="deviceCode:988|values:{\"Trans\":1, \"Data\":\"Temp \| \'"+(String)temperature+"\'\"}";
  String json=""+(String)temperature+"";
             char data[json.length()+1];
             json.toCharArray(data,json.length()+1);
             client.publish("D2C/988" , data);         

  
   if (!client.connected()) {
    uint32_t now = millis();
    // Reconnect if it's longer than MQTT_RECONNECT_TIME since we last tried.
    if (now - lastReconnectAttempt > MQTT_RECONNECT_TIME) {
      lastReconnectAttempt = now;
      Serial.println("client mqtt not connected, trying to connect");
      // Attempt to reconnect
      if (reconnect()) {
        lastReconnectAttempt = 0;
        if (boot) {
          //mqtt_client.publish(MQTTack, "CLAY Server just booted");
          Serial.println("CLAY Server just booted");
          boot = false;
        } else {
         // mqtt_client.publish(MQTTack, "CLAY Server just (re)connected to MQTT");
         Serial.println("CLAY Server just (re)connected to MQTT");
        }
      }
    }
  } else {
    // MQTT loop
    client.loop();
  }

//  irsend.sendRaw(rawData, 67, 38);  // Send a raw data capture at 38kHz.
client.subscribe(subscribe_topic);
}
