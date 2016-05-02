from flask import Flask , request
app = Flask(__name__)

import redis

@app.route("/iptrace")
def main():

	#0.38.152 test ip
	ipadd = request.args.get('ipadd')

	r_server = redis.Redis('localhost')
	
	return r_server.get(ipadd);


if __name__ == "__main__":
    app.run()	