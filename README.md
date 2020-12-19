# DSCI 554 Project

## Team

Team name: Love554

Team members:

- Jieqing Pang (3319840460) <jieqiong@usc.edu>
- Shengjia Wu (2049305949) <wushengj@usc.edu>
- Linle Jiang (2685875026) <linlejia@usc.edu>
- Chengxiang Duan (3288443478) <duanc@usc.edu>

---

## Artifacts

__🍿  Proposal presentation__ [Transcript](presentations/proposal/TRANSCRIPT.md) | [PDF](presentations/proposal/presentation.pdf)

__🍿  Final presentation__ [Transcript](presentations/final/PRESENTATION_TRANSCRIPT.md) | [PDF](presentations/final/presentation.pdf)

__📄  Paper__ [Overleaf read only link](https://www.overleaf.com/project/5fb359ba1c2e08e11d33cf43) | [PDF](paper/DSCI554_project_.pdf)

__🚢  Demo__ [Transcript](video/TRANSCRIPT.md) | [Demo link](http://pdms.usc.edu/dsci-554-projects/project-love554/)

__🎥  Video__ [Transcript](video/TRANSCRIPT.md) | [YouTube link](https://youtu.be/R-OWenNrUKA)

---

## Project Summary

---

## Contributions

## Proposal presentation

- [Jieqing Pang](mailto:jieqiong@usc.edu) planned project, modified transcripts, wrote transcript.md and readme.md.
- [Shengjia Wu](wushengj@usc.edu) planned project, modified transcripts and designed slides.
- [Linle Jiang](linlejia@usc.edu) planned project, drafted the transcript, modified transcripts and designed slides.
- [Chengxiang Duan](duanc@usc.edu) planned project, modified transcripts, designed slides and created sozi.


## Final presentation

- [Jieqing Pang](mailto:jieqiong@usc.edu) created top10, bottom10, trip duration bar charts, wrote transcript.md and readme.md, and designed slides.
- [Shengjia Wu](wushengj@usc.edu) designed and implemented web page style, and designed slides.
- [Linle Jiang](linlejia@usc.edu) processed data and creat heatmap, and designed slides.
- [Chengxiang Duan](duanc@usc.edu) constructed vue framework, created donut chart, day distribution, designed slides, and created sozi.

## Paper

- [Jieqing Pang](mailto:jieqiong@usc.edu) wrote Related Work, System, Conclusion and Reference.
- [Shengjia Wu](wushengj@usc.edu) wrote Introduction, System, Conclusion and Reference.
- [Linle Jiang](linlejia@usc.edu) wrote Approach, System, Conclusion and Reference
- [Chengxiang Duan](duanc@usc.edu) wrote Data, System, Conclusion and Reference.

## Demo

- [Jieqing Pang](mailto:jieqiong@usc.edu) introduced the reason for 'station' page, user cases and responsive design
- [Shengjia Wu](wushengj@usc.edu) introduced each graph in 'region' page
- [Linle Jiang](linlejia@usc.edu) given an overview of the project, introduced team member, the reason for 'region' page, and user cases
- [Chengxiang Duan](duanc@usc.edu) introduced each graph in 'station' page

### List of visualizations
| Requirement                            | Label        |
| -------------------------------------- | ------------ |
| responsive d3 chart                    | responsive   |
| interactive d3 chart                   | interactive  |
| d3 chart with an animated transition   | animated     |
| d3 layout                              | layout       |
| d3 map                                 | map          |
| Mapbox map                             | mapbox       |

Table 1: Table of minimum requirements, 1 of each category is required.

In Table2, list all the charts and tables in your pages including minimum requirements labels when applicable.

| Page name | Chart description | Libraries used | Requirement label |
| --------- | ----------------- | -------------- | ----------------- |
|region|d3map| d3, topojson   | map|
|region|region statistics multi-line chart|d3|responsive, interactive, animated|
|region|Heatmap of station popularity for each quarter|mapbox-gl, d3|mapbox|
|station|Top 10 popular station of each quarter (bar chart)|d3|responsive, interactive, animated|
|station|Bottom 10 popular station of each quarter (bar chart)|d3|responsive, interactive, animated|
|station|slippy map|leaflet, d3|mapbox|
|station|trip duration distribution (histogram)|d3|responsive, interactive, animated|
|station|related staion trip times (donut chart)|d3|responsive, interactive, animated, layout|
|station|busy time distribution (line chart)|d3|responsive, interactive, animated|

Table2: Table of visualizations
