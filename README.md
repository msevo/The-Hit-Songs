# THE_HIT_SONGS
This program will prompt the user for a mp3 upload or youtube link, then run it through a version of the KNN (K-nearest neighbors) machine learning algorithm that will predict it to be a "hit" or "not a hit".

**Tech Stack**

- Node.js
- Express.js
- HTML/CSS/JS

The program analyzes four features of each uploaded song:

1. Average Frequency
2. Mode Frequency
3. BPM (Beats Per Minute)
4. Duration

It analyzes these features on the client-side using the web-audio-api along with some other frontend libraries. 
It then passes a JSON array with these features to the backend via an XML HTTP POST Request. 

The backend accepts the array and routes it the machineLearning.js file, which uses a trained  kNN (k-nearest neighbors) machine learning algorithm to classify the array as a 0 (not a hit) or 1 (a hit). 

After classification, the 0 or 1 is returned via HTTP, and the "hit" or "not a hit" page is rendered depending on the returned value. 

To Run Locally:

1. npm install
2. npm start
3. node server
4. Navigate to localhost:8080 in Chrome browser 

**ONLY WORKS IN CHROME FOR NOW** 

I am a musician. I've played piano as a hobby since I was child, and recently I've decided to attempt to produce professional-grade music.
I've made several songs over the past couple of months, but I wanted to accurately gauge if they were good pieces of music before releasing them.
Thus came the idea for a machine learning algorithm that can determine hit songs!

I plan to release the program in the future online as a web application accessible through the domain "thehitsongs.com". I've purchased the domain and will hopefully get around to uploading it in the coming months. I'd like to improve it in these ways before I do so:

1. Decrease latency of converting youtube links into mp3 files. The current method downloads the entire mp4, and converts
that mp4 to an mp3 using ffmpeg. However, I have a feeling there is a way to only download the audio from the file online,
 thus decreasing the size of the file needed to be downloaded and, in turn, improving the latency. 
2. Start audio analysis while user's file is being uploaded. This would decrease the amount of time taken to upload and analyze the song. 
I believe this could potentially be done by reading the user's uploaded file as an audio stream, thus taking the first 20 seconds as a packet
 and analyzing everything besides the duration with the small 20 second packet. 
3. Re-approach the user interface to facilitate a more user-friendly experience. 

