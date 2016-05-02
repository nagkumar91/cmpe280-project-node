import csv

import simplejson as json 

import redis

import IP2Location;

r_server = redis.Redis('localhost')

IP2LocObj = IP2Location.IP2Location();
IP2LocObj.open("IP-COUNTRY-REGION-CITY-LATITUDE-LONGITUDE-ZIPCODE-TIMEZONE-ISP-DOMAIN-NETSPEED-AREACODE-WEATHER-MOBILE-ELEVATION-USAGETYPE-SAMPLE.BIN");
rec = IP2LocObj.get_all("19.5.10.1");

for x in range(99):
	for y in range(255):
		for z in range(255):
			ip_gen = '{}.{}.{}.255'.format(x,y,z)
			ip_detail = IP2LocObj.get_all(ip_gen);
			#print(str(ip_detail.latitude) + "    " + str(ip_detail.longitude))

			data = {}
			data['latitude'] = ip_detail.latitude;
			data['longitude'] = ip_detail.longitude;
			data['country'] = ip_detail.country_long;
			data['region'] = ip_detail.region;
			data['city'] = ip_detail.city;

			ip_detail_json = json.dumps(data);

			ip_key = '{}.{}.{}'.format(x,y,z)
			r_server.set(ip_key,ip_detail_json);


