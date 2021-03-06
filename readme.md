# Front End Developer Exam
## Introduction
This exam use the SoundCloud API to fetch data and display it on a page.
Vanila JS UI with Sound Cloud APi integration.

### External URL 
- [GitHubPages-SoundCloudApiUI](https://yonatan-gala.github.io/soundCloudApiUi/)

### API details
- [soundcloud API docs](https://developers.soundcloud.com/docs/api/guide)
-  client_id:E8IqLGTYxHll6SyaM7LKrMzKveWkcrjg 

#### Browser Support
-  latest Chrome release

#### requested layout and elements:
1.Search container which contains
  1. A text box
  2. A button or link to trigger the search
  3. A container for the search results
  4. A next button at the bottom
2. Image container 

### requested functionality
1. Use the SoundCloud API to allow the user to search for anything entered in the
search box. 
2. The names of the results should be displayed as a list below the text box. 
Only fetch 6 results at a time.
3. result item contains 'names'.(band,album, artist).
4. pagination based result navigation.
5. When a search result is clicked, it should fly to the Image Container, fade out and
the image for the search result should fade in instead.
6. When clicking the central image, embed the track below the image and make it
play 
7. Keep a visual history of the searches. This history should display the last 5
searches and should be available for the user in subsequent visits.
8. When clicked, a search history item should instigate a new search. 

#### Added functionality
1. show last search terms after new search
2. show search terms in local storage for returning visits.
3. responsive.
4. UI visual styles
6. SCSS lint. 
  
#### Code related info
1. Dependencies: 
   1. NPM
      1. Scss
      2. gulp
      3. local server
      
##### CLI commands
1. gulp (default)
2. gulp connect
2. gulp build
3. gulp watch
4. gulp lint.      
