# RealTime Stock Market 

## Data
- Link to "Choose Data" issue: [Choose Data](https://gitlab.com/dawson-cst-cohort-2026/520/section2/teams/TeamM-23-ChristianHaiderRyan/520-project-bui-ahmed-graceffa/-/issues/2)

### Dataset 1:
- **Name:** Stock Market Dataset  
- **Format:** CSV files  
- **Size:** Contains approximately **8,050 files** (≈ 2.75 GB total) including both ETF and stock data  
- **Part Used:** We will use the stock price history (open, close, volume, etc.) to visualize performance trends and identify patterns among selected major companies and ETFs.  
- **Source:** [kaggle.com/datasets/jacksoncrow/stock-market-dataset](https://www.kaggle.com/datasets/jacksoncrow/stock-market-dataset)  
- **License:** Public Domain  

### Dataset 2:
- **Name:** Financial News Headlines Data  
- **Format:** CSV files  
- **Size:** Approximately **11.83 MB total**, with **3 CSV files** (`cnbc_headlines.csv`, `guardian_headlines.csv`, and `reuters_headlines.csv`) covering roughly **53,000 headlines** from **2017 – 2020**  
- **Part Used:** We will use the headline text and publication date to analyze how financial news sentiment may have influenced stock and ETF movements.  
- **Source:** [kaggle.com/datasets/notlucasp/financial-news-headlines](https://www.kaggle.com/datasets/notlucasp/financial-news-headlines)  
- **License:** Public Domain  



## API
You must describe at least 3 endpoints (since team of 3). For example:
- `GET /api/stocks` – Fetch list of stocks available

- `GET /api/stocks/history` – Fetch detailed info about the stocks (history of stock)

- `GET /api/stocks/news` – Fetch news related to a specific stock on dates when the price changed a lot

## Visualizations
- Describe planned interactive visualization(s).
	1. Home screen that will just be the default page where you click a button to go to one of the other views.
	2. Reactive grid hopefully that will show stock prices changes over time  and will have different colors.
	3. Comparing stocks so 2 drop down menus showing 1 stock and another stock and once clicked it will 		   compare both
- What story you want to tell with the data: 
	We want to tell with our data, what most likely market you should involve with regarding stocks to make 	your bank account go up instead of investing in something terrible.

- What users should learn from it.
	They should learn which companies have consistent stock, how to compare different stocks and how some news 	events affect the stock prices.

## Views
You must have 3 views (team of 3).
- View 1: Stock Grid
    Layout: Grid of stocks showing the most popular companies.
    Functionality:  Each will have a legend and will have an assigned color to it and once you see the grid you 		    should be able to tell which stock it is based on its grid color, and it should display the  		    price and if the stock is going up the price will turn green and if going down it will be red.

- View 2:  Detailed stock Analysis
    Layout: This will display everything and will have data range, price range and all the filters regarding a 		    certain stock you are willing to buy and it will have a bar regarding the news of this said stock.
    Functionality: show prices historically meaning if you would like to check the start from the past year you 		   should be able to, news headers with dates regarding the stock company, and when the prices  		   changes, maybe different filters

- View 3: Compare Stocks 
    Layout: This will display two chosen stocks of your choice and will compare them both to tell from their price 	    history if they are better than the other, it won't say which one, but will say what you can expect 	    from both.
    Functionality: User will be able to select two stocks of their choice and then they will be compared, but not 		   saying one is better than the other but by their history and at the end it will say which has 		   the higher chance of	giving you more money


## Functionality
- User interactions:

  - Clicking: you should be able to click on a certain company you would like to see and it will display that 		      companies stock and the news that come with it.

  - Searching/filtering: You should be able to search for the certain company you would like to see and filtering 			 should be how you would like to see the companies you would like to view.

  - Hover for tooltips: When you hover over the grid for the stock you want it should tell you why it went down and 			maybe if its related to news it will be shown with a news article. Might add a filter for 			your price range.

  - Navigation between views: there will be a home screen and will give three buttons going to either views and if 			      you click on one there should still be three buttons but, now there will be a home 			      button since you are on the current view you want to be at.

## Features and Priorities
- **Core features (must-have):**
  - Display of grid of popular stocks with color, to tell them apart
  - stock price history with chart
  - filter for stock
  - comparing stocks page
  - News page for the stock
  - Must work on mobile
  - Green and red color to indicate if its losing or gaining money
- **Stretch features (nice-to-have, cut if time is short):**
  - Filtering news by category
  - comparing more than 2 stocks together
  - more advance statistic making it more accurate.

## Dependencies
- Visualization library (or libraries) to use and why:
  - Reactive charts
  - Parse a csv file
  - Database
  - We will be using this for the grid: 
    https://plotly.com/javascript/line-charts/
