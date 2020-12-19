# TRANSCRIPT

Topic: Metro bike sharing

Team name: Love554

Team members:

- Jieqing Pang (3319840460) <jieqiong@usc.edu>
- Shengjia Wu (2049305949) <wushengj@usc.edu>
- Linle Jiang (2685875026) <linlejia@usc.edu>
- Chengxiang Duan (3288443478) <duanc@usc.edu>

---

## Slide 1
Hello Everyone! Today we want to tell you a story about LA Metro Bike sharing system. Our team is Love554. And my name is Jieqiong Pang (My name is Shengjia Wu, My name is Linle jiang, My name is Chengxiang Duan), we are all from the Applied Data Science program.

## Slide 2 Introduction
This project involves visualizing geo-spatial data from LA Metro bike sharing system. According to news report, the use of shared bikes has shown some unprecedented patterns under COVID-19. Therefore, we hope to use bike sharing data to explore the usage pattern of bike sharing system.

## Slide 3 Goal and Story
With that in mind, we would like to create visualizations, including frequency distribution charts, heatmap, and so on, to help our users, short-range vehicle share service providers, understand, at least qualitatively, how the use of bike share system varied over time and across different geo-locations, especially under the effect of COVID-19.

## Slide 4 Previous Work
Compared with previous year’s ride sharing project, which seems to be focusing on the effect of infrastructure, age, and weather on station and/or trip counts, there are a number of highlights in the current project: 
1) we have a clear end user target (i.e., Short-range vehicle share service providers);
2) we plan to create a status dashboard, including daily and weekly bike use frequency, trip duration frequency distribution for the overall bike sharing system, which could provide key insights to stakeholders regarding how to plan smartly on bike deployment;
3) we plan to include a dynamic heatmap to show how the visiting frequency of stations fluctuates overtime on a map;
4) we plan to delve deeper into the station analysis by looking at the frequency distribution in the station network. That is, creating an interactive visualization for a weighted station network.

## Slide 5 Dataset
Our dataset is about Metro Bike Share. It ranges from 2016 Q3 to 2020 Q2, and there are 1M rows. We will be using the trip data, which includes trip id, start and end time, geo-location of station, and whether it is a round trip or one-way trip.

## Slide 6 Page Layout
This would be the layout of our webpage. As you can see, we would have a header pinned on the top across all pages, where users can jump from page to page. The main content would be displayed underneath it. And Nicky will introduce the visualizations in the following slides. 

## Slide 7 Multi-chart 1
Thank you, Wudy. What I am about to show you in the following slides were images of existing work in this topic. As mentioned earlier, to understand more about the ordinary use pattern, we would conduct some descriptive analyses, including ranking the station popularity by visiting frequency. Specifically, we would create a table and an ordered bar graph for the top 10 most popular stations, given a user-defined quarter. Popularities are defined by borrowed bikes, returned bikes, and combined counts, respectively. They would be included as a form of interaction provided to the users for selection. We will also create a bar chart visualizing the average trip counts by days of a week (i.e., 7 in total), given a user-defined quarter.

## Slide 8 Multi-chart 2
To understand the use pattern at a daily level, we will create a line chart visualizing the average trip counts by hours (i.e., 24 in total), given a user-defined quarter. For instance, if a trip took place between 2:20 pm to 4:50 pm, it would be counted into the 2:00 pm, 3:00 pm, and 4:00 pm categories respectively. In addition to that, we would also produce a bar chart visualizing the counts of trips lasted for the specified number of minutes (e.g., number of trips lasted for 15 mins, or 16 mins and so on and so forth), given a user-defined quarter. 

## Slide 9 Heatmap
Then, we would create a density map, which is in a form of a heatmap visualizing the total frequency of stations being visited, updated automatically with data by quarters. Note that users could also specify the desired quarter for data visualization. Hopefully this could give us some insights about the use pattern since the system was first introduced, and how it was affected by COVID-19, for instance.

## Slide 10 Station Net
Finally, we would conduct analysis only focusing at the station level. This would be an interactive map with bike stations. When users select a particular station (whether by drop down or click on the station on the map), the visualization would connect all stations that involve trips started or ended with the selected station, given a user-defined quarter. In this “connecting” mode, if users move the cursor to one of the connected stations, four bar charts would pop up showing the average borrow and return bike counts by hours and by weekdays between the two stations.

## Slide 11 Tools
In this project, we would use d3 and bokeh to design and implement the visualizations. We would also use Bootstrap for responsive web design. We may need other tools as well. We will figure it out in the future. In terms of data-preprocessing, we will construct a SQL database, and create interactive features on the web page that enables users to have direct and straightforward communications to the database. At the first stage, we attempt to allow more flexible selections on time range and test how much time it will take to load the visualizations. If it is taking too long to load the data, we will limit the user’s time selection to quarter only, and pre-compute the data needed for each quarter and store the processed data in the database.

## Slide 12 Timeline and Assignment
Here is our preliminary task timeline and assignments. Specifically, we would agilely do data processing and visualization coding, so that we could present all deliverables on Week 14. That’s a quick look about our project. Thanks for your hearing!

