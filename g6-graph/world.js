const worldData = {
  "nodes": [
    { "id": "World", "label": "World" },
    { "id": "America", "label": "America" },
    { "id": "Europe", "label": "Europe" },
    { "id": "Asia", "label": "Asia" },
    { "id": "Africa", "label": "Africa" },
    { "id": "Australia", "label": "Australia" },
    { "id": "Antarctica", "label": "Antarctica" },
    { "id": "NorthAmerica", "label": "North America" },
    { "id": "SouthAmerica", "label": "South America" },
    { "id": "Canada", "label": "Canada" },
    { "id": "USA", "label": "USA" },
    { "id": "Mexico", "label": "Mexico" },
    { "id": "Toronto", "label": "Toronto" },
    { "id": "Vancouver", "label": "Vancouver" },
    { "id": "Montreal", "label": "Montreal" },
    { "id": "Ottawa", "label": "Ottawa" },
    { "id": "Calgary", "label": "Calgary" },
    { "id": "NewYork", "label": "New York" },
    { "id": "LosAngeles", "label": "Los Angeles" },
    { "id": "Chicago", "label": "Chicago" },
    { "id": "Houston", "label": "Houston" },
    { "id": "Phoenix", "label": "Phoenix" },
    { "id": "MexicoCity", "label": "Mexico City" },
    { "id": "Guadalajara", "label": "Guadalajara" },
    { "id": "Monterrey", "label": "Monterrey" },
    { "id": "Brazil", "label": "Brazil" },
    { "id": "Argentina", "label": "Argentina" },
    { "id": "Chile", "label": "Chile" },
    { "id": "Colombia", "label": "Colombia" },
    { "id": "SaoPaulo", "label": "Sao Paulo" },
    { "id": "RioDeJaneiro", "label": "Rio de Janeiro" },
    { "id": "Brasilia", "label": "Brasilia" },
    { "id": "BuenosAires", "label": "Buenos Aires" },
    { "id": "Cordoba", "label": "Cordoba" },
    { "id": "Santiago", "label": "Santiago" },
    { "id": "Bogota", "label": "Bogota" },
    { "id": "WesternEurope", "label": "Western Europe" },
    { "id": "EasternEurope", "label": "Eastern Europe" },
    { "id": "England", "label": "England" },
    { "id": "France", "label": "France" },
    { "id": "Germany", "label": "Germany" },
    { "id": "Spain", "label": "Spain" },
    { "id": "Italy", "label": "Italy" },
    { "id": "London", "label": "London" },
    { "id": "Manchester", "label": "Manchester" },
    { "id": "Paris", "label": "Paris" },
    { "id": "Lyon", "label": "Lyon" },
    { "id": "Berlin", "label": "Berlin" },
    { "id": "Munich", "label": "Munich" },
    { "id": "Madrid", "label": "Madrid" },
    { "id": "Barcelona", "label": "Barcelona" },
    { "id": "Rome", "label": "Rome" },
    { "id": "Milan", "label": "Milan" },
    { "id": "Poland", "label": "Poland" },
    { "id": "Russia", "label": "Russia" },
    { "id": "Warsaw", "label": "Warsaw" },
    { "id": "Moscow", "label": "Moscow" },
    { "id": "SaintPetersburg", "label": "Saint Petersburg" },
    { "id": "CentralAsia", "label": "Central Asia" },
    { "id": "EastAsia", "label": "East Asia" },
    { "id": "SouthAsia", "label": "South Asia" },
    { "id": "SoutheastAsia", "label": "Southeast Asia" },
    { "id": "WestAsia", "label": "West Asia" },
    { "id": "Kazakhstan", "label": "Kazakhstan" },
    { "id": "Uzbekistan", "label": "Uzbekistan" },
    { "id": "Turkmenistan", "label": "Turkmenistan" },
    { "id": "Almaty", "label": "Almaty" },
    { "id": "NurSultan", "label": "Nur-Sultan" },
    { "id": "Tashkent", "label": "Tashkent" },
    { "id": "Ashgabat", "label": "Ashgabat" },
    { "id": "China", "label": "China" },
    { "id": "Japan", "label": "Japan" },
    { "id": "SouthKorea", "label": "South Korea" },
    { "id": "Beijing", "label": "Beijing" },
    { "id": "Shanghai", "label": "Shanghai" },
    { "id": "Guangzhou", "label": "Guangzhou" },
    { "id": "Shenzhen", "label": "Shenzhen" },
    { "id": "Tokyo", "label": "Tokyo" },
    { "id": "Osaka", "label": "Osaka" },
    { "id": "Seoul", "label": "Seoul" },
    { "id": "India", "label": "India" },
    { "id": "Pakistan", "label": "Pakistan" },
    { "id": "NewDelhi", "label": "New Delhi" },
    { "id": "Mumbai", "label": "Mumbai" },
    { "id": "Bangalore", "label": "Bangalore" },
    { "id": "Islamabad", "label": "Islamabad" },
    { "id": "Thailand", "label": "Thailand" },
    { "id": "Vietnam", "label": "Vietnam" },
    { "id": "Bangkok", "label": "Bangkok" },
    { "id": "Hanoi", "label": "Hanoi" },
    { "id": "SaudiArabia", "label": "Saudi Arabia" },
    { "id": "Iran", "label": "Iran" },
    { "id": "Riyadh", "label": "Riyadh" },
    { "id": "Tehran", "label": "Tehran" },
    { "id": "NorthAfrica", "label": "North Africa" },
    { "id": "WestAfrica", "label": "West Africa" },
    { "id": "EastAfrica", "label": "East Africa" },
    { "id": "CentralAfrica", "label": "Central Africa" },
    { "id": "SouthernAfrica", "label": "Southern Africa" },
    { "id": "Egypt", "label": "Egypt" },
    { "id": "Cairo", "label": "Cairo" },
    { "id": "Nigeria", "label": "Nigeria" },
    { "id": "Lagos", "label": "Lagos" },
    { "id": "Kenya", "label": "Kenya" },
    { "id": "Nairobi", "label": "Nairobi" },
    { "id": "DemocraticRepublicOfCongo", "label": "Democratic Republic of the Congo" },
    { "id": "Kinshasa", "label": "Kinshasa" },
    { "id": "SouthAfrica", "label": "South Africa" },
    { "id": "Johannesburg", "label": "Johannesburg" },
    { "id": "AustraliaCapital", "label": "Canberra" },
    { "id": "Sydney", "label": "Sydney" },
    { "id": "Melbourne", "label": "Melbourne" },
    { "id": "Brisbane", "label": "Brisbane" },
    { "id": "Perth", "label": "Perth" },
    { "id": "Adelaide", "label": "Adelaide" },
    { "id": "McMurdoStation", "label": "McMurdo Station" },
    { "id": "PalmerStation", "label": "Palmer Station" },
    { "id": "AmundsenScottStation", "label": "Amundsen-Scott Station" },
    { "id": "VostokStation", "label": "Vostok Station" }
  ],
  "edges": [
    { "source": "World", "target": "America" },
    { "source": "World", "target": "Europe" },
    { "source": "World", "target": "Asia" },
    { "source": "World", "target": "Africa" },
    { "source": "World", "target": "Australia" },
    { "source": "World", "target": "Antarctica" },
    { "source": "America", "target": "NorthAmerica" },
    { "source": "America", "target": "SouthAmerica" },
    { "source": "NorthAmerica", "target": "Canada" },
    { "source": "NorthAmerica", "target": "USA" },
    { "source": "NorthAmerica", "target": "Mexico" },
    { "source": "Canada", "target": "Toronto" },
    { "source": "Canada", "target": "Vancouver" },
    { "source": "Canada", "target": "Montreal" },
    { "source": "Canada", "target": "Ottawa" },
    { "source": "Canada", "target": "Calgary" },
    { "source": "USA", "target": "NewYork" },
    { "source": "USA", "target": "LosAngeles" },
    { "source": "USA", "target": "Chicago" },
    { "source": "USA", "target": "Houston" },
    { "source": "USA", "target": "Phoenix" },
    { "source": "Mexico", "target": "MexicoCity" },
    { "source": "Mexico", "target": "Guadalajara" },
    { "source": "Mexico", "target": "Monterrey" },
    { "source": "SouthAmerica", "target": "Brazil" },
    { "source": "SouthAmerica", "target": "Argentina" },
    { "source": "SouthAmerica", "target": "Chile" },
    { "source": "SouthAmerica", "target": "Colombia" },
    { "source": "Brazil", "target": "SaoPaulo" },
    { "source": "Brazil", "target": "RioDeJaneiro" },
    { "source": "Brazil", "target": "Brasilia" },
    { "source": "Argentina", "target": "BuenosAires" },
    { "source": "Argentina", "target": "Cordoba" },
    { "source": "Chile", "target": "Santiago" },
    { "source": "Colombia", "target": "Bogota" },
    { "source": "Europe", "target": "WesternEurope" },
    { "source": "Europe", "target": "EasternEurope" },
    { "source": "WesternEurope", "target": "England" },
    { "source": "WesternEurope", "target": "France" },
    { "source": "WesternEurope", "target": "Germany" },
    { "source": "WesternEurope", "target": "Spain" },
    { "source": "WesternEurope", "target": "Italy" },
    { "source": "England", "target": "London" },
    { "source": "England", "target": "Manchester" },
    { "source": "France", "target": "Paris" },
    { "source": "France", "target": "Lyon" },
    { "source": "Germany", "target": "Berlin" },
    { "source": "Germany", "target": "Munich" },
    { "source": "Spain", "target": "Madrid" },
    { "source": "Spain", "target": "Barcelona" },
    { "source": "Italy", "target": "Rome" },
    { "source": "Italy", "target": "Milan" },
    { "source": "EasternEurope", "target": "Poland" },
    { "source": "EasternEurope", "target": "Russia" },
    { "source": "Poland", "target": "Warsaw" },
    { "source": "Russia", "target": "Moscow" },
    { "source": "Russia", "target": "SaintPetersburg" },
    { "source": "Asia", "target": "CentralAsia" },
    { "source": "Asia", "target": "EastAsia" },
    { "source": "Asia", "target": "SouthAsia" },
    { "source": "Asia", "target": "SoutheastAsia" },
    { "source": "Asia", "target": "WestAsia" },
    { "source": "CentralAsia", "target": "Kazakhstan" },
    { "source": "CentralAsia", "target": "Uzbekistan" },
    { "source": "CentralAsia", "target": "Turkmenistan" },
    { "source": "Kazakhstan", "target": "Almaty" },
    { "source": "Kazakhstan", "target": "NurSultan" },
    { "source": "Uzbekistan", "target": "Tashkent" },
    { "source": "Turkmenistan", "target": "Ashgabat" },
    { "source": "EastAsia", "target": "China" },
    { "source": "EastAsia", "target": "Japan" },
    { "source": "EastAsia", "target": "SouthKorea" },
    { "source": "China", "target": "Beijing" },
    { "source": "China", "target": "Shanghai" },
    { "source": "China", "target": "Guangzhou" },
    { "source": "China", "target": "Shenzhen" },
    { "source": "Japan", "target": "Tokyo" },
    { "source": "Japan", "target": "Osaka" },
    { "source": "SouthKorea", "target": "Seoul" },
    { "source": "SouthAsia", "target": "India" },
    { "source": "SouthAsia", "target": "Pakistan" },
    { "source": "India", "target": "NewDelhi" },
    { "source": "India", "target": "Mumbai" },
    { "source": "India", "target": "Bangalore" },
    { "source": "Pakistan", "target": "Islamabad" },
    { "source": "SoutheastAsia", "target": "Thailand" },
    { "source": "SoutheastAsia", "target": "Vietnam" },
    { "source": "Thailand", "target": "Bangkok" },
    { "source": "Vietnam", "target": "Hanoi" },
    { "source": "WestAsia", "target": "SaudiArabia" },
    { "source": "WestAsia", "target": "Iran" },
    { "source": "SaudiArabia", "target": "Riyadh" },
    { "source": "Iran", "target": "Tehran" },
    { "source": "Africa", "target": "NorthAfrica" },
    { "source": "Africa", "target": "WestAfrica" },
    { "source": "Africa", "target": "EastAfrica" },
    { "source": "Africa", "target": "CentralAfrica" },
    { "source": "Africa", "target": "SouthernAfrica" },
    { "source": "NorthAfrica", "target": "Egypt" },
    { "source": "Egypt", "target": "Cairo" },
    { "source": "WestAfrica", "target": "Nigeria" },
    { "source": "Nigeria", "target": "Lagos" },
    { "source": "EastAfrica", "target": "Kenya" },
    { "source": "Kenya", "target": "Nairobi" },
    { "source": "CentralAfrica", "target": "DemocraticRepublicOfCongo" },
    { "source": "DemocraticRepublicOfCongo", "target": "Kinshasa" },
    { "source": "SouthernAfrica", "target": "SouthAfrica" },
    { "source": "SouthAfrica", "target": "Johannesburg" },
    { "source": "Australia", "target": "AustraliaCapital" },
    { "source": "AustraliaCapital", "target": "Sydney" },
    { "source": "AustraliaCapital", "target": "Melbourne" },
    { "source": "AustraliaCapital", "target": "Brisbane" },
    { "source": "AustraliaCapital", "target": "Perth" },
    { "source": "AustraliaCapital", "target": "Adelaide" },
    { "source": "Antarctica", "target": "McMurdoStation" },
    { "source": "Antarctica", "target": "PalmerStation" },
    { "source": "Antarctica", "target": "AmundsenScottStation" },
    { "source": "Antarctica", "target": "VostokStation" }
  ]
}