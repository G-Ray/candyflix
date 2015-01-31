candyflix
=========

Popcorn Time as a Nodejs app :D

Screenshots
-----------

![movies](http://i.imgbox.com/xhKiKzh3.png)

![tvshows](http://i.imgbox.com/YZG0Gp8f.png)

Installation
-------

1. Install Node.js
2. Install peerflix
3. Serve the frontend folder with your favorite webserver
4. Set a proxypass to redirect from /socket.io/ to http://localhost:3000

 Exemple with nginx:
 ```
  location /socket.io/ {
      proxy_pass http://localhost:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
  }
```
5. The fun part :

   ```
cd app
npm install
node candyflix.js
```


Credits
-------

Popcorn Time and Time4popcorn

Dageiko for the candyfloss logo (http://dageiko.deviantart.com/)
