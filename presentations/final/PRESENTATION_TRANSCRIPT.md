# TRANSCRIPT

Topic: Metro bike sharing

Team name: Love554

Team members:

- Jieqing Pang (3319840460) <jieqiong@usc.edu>
- Shengjia Wu (2049305949) <wushengj@usc.edu>
- Linle Jiang (2685875026) <linlejia@usc.edu>
- Chengxiang Duan (3288443478) <duanc@usc.edu>

---

## Slide 0
Hello Everyone! Today we want to present you our project about the visualization of the LA Metro Bike sharing system. Our team is Love554. And my name is Jieqiong Pang (My name is Shengjia Wu, My name is Linle jiang, My name is Chengxiang Duan).

## Slide 1 Introduction
This project involves visualizing geospatial data from LA Metro bike sharing system. We choose bike service providers as our target users. Our goal is to help them make informed decisions, such as optimizing station planning and bike deployments.

## Slide 2 Previous Work
One prior bike sharing project done in this class seemed to be mostly focusing on the effect of station location, age, and weather on bike usage. To the best of our knowledge, we couldn’t identify existing dashboard visualizations that are carefully designed for service providers.

## Slide 3 Idea
Therefore, we want to build something new for this project. We first identified our target users and brainstormed the user cases. Our vision is to build a service monitor tool that could provide actionable insights for our users to help them achieve their key business objectives, especially in logistic optimization.

## Slide 4 Dataset
Our dataset contains Metro Bike station information and trip records, from which we could extract information on bike use pattern, station distribution and popularity, providing stakeholders insights on bike deployment and station planning. 

## Slide 5 Design process
The goal is to ensure that our users are able to grasp the general operating status of each region, also allowing them to dig information from specific stations. After setting our goal, we established the User Cases and developed a prototype for the website. 

## Slide 6 Vue framework
We began to structure our website in the next step. We processed the data as GeoJson and used Vue to control the data flow. Data is loaded on Vue based on user’s choice. Then data flows to each component from the top and triggers the chart generator.

## Slide 7 Web page design
Our design process is quite complete. Based on UI and layout of the prototype we designed, we use flexbox, grid, and sass to achieve a responsive effect. Also, we used bootstrap-vue to create a navbar. As a result, when the window size changes, the components move to fit the window cascading.

## Slide 8 Heatmap
Since our goal is to generate insights, we want to visualize the demands, that is how the use pattern changed over time. This gives our user a starting point, an opportunity to evaluate their business decisions at a high level. Users can also use the heatmap to find areas by station popularities.

## Slide 9 Station charts
When it comes to actionable insights, here we focus the analyses at the station level. Specifically, we built responsive and interactive d3 charts with animated transition using simple or advanced layout, including line charts, bar charts and donut charts. We also include a d3 map to show station growth.

## Slide 10 Future work
We want to mention that we were using Git in development, and it benefits our collaboration. If time permits, in the future, we want to automate the ETL process with a PostgreSQL database. Eventually, with a simple click, users could see the real-time visualization.



