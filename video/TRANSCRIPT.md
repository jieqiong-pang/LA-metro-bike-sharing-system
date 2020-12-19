# TRANSCRIPT

Topic: Metro bike sharing

Team name: Love554

Team members:

- Jieqing Pang (3319840460) <jieqiong@usc.edu>
- Shengjia Wu (2049305949) <wushengj@usc.edu>
- Linle Jiang (2685875026) <linlejia@usc.edu>
- Chengxiang Duan (3288443478) <duanc@usc.edu>

---

## Project Introduction
### Linle: 
Hello everyone! In this video, we want to give you a demo on a visualization tool we built for the LA Metro bike share service providers.

LA Metro bike share is a bicycle sharing system. With the increasing bike share activities, service providers need to constantly optimize their operations, including station planning and bike deployment. Therefore, we targeted service providers as our end users and built a service monitoring tool to help them make informed decisions about these operations.

We divided our visualizations into region-level and station-level. The goal here is to ensure our users are able to understand the general operating status at the region-level, and narrow down the evaluation to a more specific area in a particular quarter, then focus the analyses at the station-level.

--- 

## Region Page
### Shengjia: 
In this region-level page, we can visualize the station operations in regions over time and find interesting small areas. 
This is a vector map of LA. Each point stands for a station. If the users click a point, the whole region it belongs to will be highlighted, and it triggers this multi line chart of this region. In this chart, we can see three lines changing over time. These three metrics help users to evaluate the performance of a region. When users mouse over a data point, all data points in that quarter are highlighted and detailed data is shown. 
The selected region also adjusts the center and zoom level of the heatmap. The heatmap shows how popular an area is. The darker the red, the more popular the area is. Users can drag the slider to review the popularity and the most popular stations in a specific quarter, and also observe the changes.

### Linle: 
Let’s say that a station planning decision was made at a particular quarter in a particular area. In this case, to evaluate a decision, users might first specify a region they are interested in, for instance, DTLA, and then use the result from the line chart to identify the particular time about the decision they want to evaluate. For example, in this case the decision made between Q4 of 2018 to Q1 of 2019 seems interesting because the number of new stations increased, didn’t yield a corresponding increase in trip durations, which is important as the price of a trip was determined by trip duration. Then, users might move to the heatmap to identify the area where the decision was about. As you can see, when we drag the slider to Q4 in 2018 and Q1 of 2019, we can tell that the station popularity in this region seems to be relatively stable, despite more stations being opened in this area. Users might want to use the region-level visualizations as a starting point, and narrow down their interests to a specific area for further analyses.

---

## Station Page

### Chengxiang:
Let’s take a look at station-level.

The page generally consists of seven visualization tiles. Users can choose a quarter in the navbar. Then, two tiles show the most and least popular stations in a quarter on the top left, respectively. 

Underneath, there is a map with station dots on it. When the user clicks a target station, lines will show up between the target station and its related stations, indicating trips between the two stations. The line width represents the trip count between the two stations. 
The right part of the page shows detailed information about a station. 

On this page, users can also choose a target station by double-clicking the bar chart or donut chart.

### Jieqiong:
Continuing on the region-level analysis example, after users identified the area near Downtown LA region in 2019Q1, users could select a station in this area to get more insights, like this one, and compare with another station. Comparing these two stations, we can clearly see that station 4315 has a low traffic flow, and relatively shorter based on ‘Total Trip Counts’ and ‘Total Trip Duration’. And it seems like stations within a cluster or near Downtown LA have more popularities, compared to stations that are located at the margin of the cluster. 

Additionally, users can use the ‘Most and Least popular stations’ bar chart to select one station by double clicking each bar to connect the map data. For example, when we click on this station, there is clearly a heavy traffic flow between these two stations, same thing from the Donut chart. Based on that, users might want to consider their bike deployment or station planning strategies with regards to these two stations.

---

## Responsive Desgin
### Jieqiong:
One more thing, as you can see, our website is responsive. It fits well with PC, ipad, and mobile phones. With that, thank you so much for watching this video.