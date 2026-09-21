import { BenchmarkCase } from "../types";

export const RAGTRUTH_BENCHMARK_CASES: BenchmarkCase[] = [
  {
    "id": "case-ragtruth-summary-01",
    "dataset": "RAGTruth",
    "taskType": "Summary",
    "domain": "RAGTruth Official Corpus (Summary - gpt-4-0613)",
    "query": "Summarize the following news within 89 words:\nAndrew Getty, one of the heirs to billions of oil money, appears to have died of natural causes, a Los Angeles Police Department spokesman said. The coroner's preliminary assessment is there was no foul play involved in the death of Getty, grandson of oi...",
    "generatedAnswer": "Andrew Getty, oil tycoon J. Paul Getty's grandson, has died at the age of 47. The Los Angeles Police Department said Getty's death appears to have been from natural causes, and there was no foul play involved. A spokesman said Getty had several health issues and an autopsy will be conducted. There is currently no criminal investigation underway. The Getty family fortune is estimated to be about $5 billion.",
    "retrievedContext": "[Document: RAGTruth_Summary_Source_15593.txt]\nAndrew Getty, one of the heirs to billions of oil money, appears to have died of natural causes, a Los Angeles Police Department spokesman said. The coroner's preliminary assessment is there was no foul play involved in the death of Getty, grandson of oil tycoon J. Paul Getty, said Detective Meghan Aguilar. Andrew Getty, 47, had \"several health issues,\" Aguilar said, adding that an autopsy will be conducted. There is no criminal investigation underway, he said. Some medication had also been recovered from Getty's home, though investigators don't know whether Getty was taking it or what his medical history was, Ed Winter, assistant chief in the Los Angeles County coroner's office, told CNN affiliate KTLA Tuesday night. KTLA reported that Getty was found on his side near a bathroom in his home. Getty's parents, Ann and Gordon Getty, released a statement confirming their son's death and asking for privacy. Where the Getty family fortune came from. Gordon Getty is one of three living sons of J. Paul Getty, the oil baron who was thought to be the richest man in the world at the time of his death in 1976. Gordon Getty, 81, has a net worth of $2.1 billion, according to Forbes. One other son died in 1958 and another died in 1973. Gordon Getty spearheaded the controversial sale of Getty to Texaco for $10 billion in 1984. In its list of richest American families, Forbes estimated the Gettys' net worth to be about $5 billion. Court records show Andrew Getty had recently filed to get a restraining order against an ex-girlfriend. A hearing in the case had been scheduled for next week. In his request, Getty said he had been diagnosed with a serious medical condition in 2013. \"A rise in my blood pressure places me in grave risk of substantial and irreparable injury or death,\" he wrote in the petition. \"My doctors have advised that heated arguments can cause my blood pressure to rise dangerously.\" Andrew Getty had three brothers and three half-sisters. People we've lost in 2015. CNN's Doug Criss, Janet DiGiacomo, Mark Mooney, Mike Love, Julie In and Cheri Mossburg contributed to this report.",
    "groundTruthClaims": [
      {
        "claimText": "Andrew Getty, oil tycoon J. Paul Getty's grandson, has died at the age of 47.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "The Los Angeles Police Department said Getty's death appears to have been from natural causes, and there was no foul play involved.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "A spokesman said Getty had several health issues and an autopsy will be conducted.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "There is currently no criminal investigation underway.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "The Getty family fortune is estimated to be about $5 billion.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-summary-02",
    "dataset": "RAGTruth",
    "taskType": "Summary",
    "domain": "RAGTruth Official Corpus (Summary - gpt-3.5-turbo-0613)",
    "query": "Summarize the following news within 89 words:\nAndrew Getty, one of the heirs to billions of oil money, appears to have died of natural causes, a Los Angeles Police Department spokesman said. The coroner's preliminary assessment is there was no foul play involved in the death of Getty, grandson of oi...",
    "generatedAnswer": "Andrew Getty, one of the heirs to billions of oil money, has died of natural causes, according to the Los Angeles Police Department. The coroner's preliminary assessment suggests no foul play was involved. Getty, 47, had multiple health issues and an autopsy will be conducted. No criminal investigation is underway. Getty's parents released a statement confirming their son's death and asking for privacy. Andrew Getty was one of the grandchildren of oil tycoon J. Paul Getty, and the Getty family fortune is estimated to be around $5 billion. Getty had recently filed for a restraining order against an ex-girlfriend and cited his serious medical condition as a reason.",
    "retrievedContext": "[Document: RAGTruth_Summary_Source_15593.txt]\nAndrew Getty, one of the heirs to billions of oil money, appears to have died of natural causes, a Los Angeles Police Department spokesman said. The coroner's preliminary assessment is there was no foul play involved in the death of Getty, grandson of oil tycoon J. Paul Getty, said Detective Meghan Aguilar. Andrew Getty, 47, had \"several health issues,\" Aguilar said, adding that an autopsy will be conducted. There is no criminal investigation underway, he said. Some medication had also been recovered from Getty's home, though investigators don't know whether Getty was taking it or what his medical history was, Ed Winter, assistant chief in the Los Angeles County coroner's office, told CNN affiliate KTLA Tuesday night. KTLA reported that Getty was found on his side near a bathroom in his home. Getty's parents, Ann and Gordon Getty, released a statement confirming their son's death and asking for privacy. Where the Getty family fortune came from. Gordon Getty is one of three living sons of J. Paul Getty, the oil baron who was thought to be the richest man in the world at the time of his death in 1976. Gordon Getty, 81, has a net worth of $2.1 billion, according to Forbes. One other son died in 1958 and another died in 1973. Gordon Getty spearheaded the controversial sale of Getty to Texaco for $10 billion in 1984. In its list of richest American families, Forbes estimated the Gettys' net worth to be about $5 billion. Court records show Andrew Getty had recently filed to get a restraining order against an ex-girlfriend. A hearing in the case had been scheduled for next week. In his request, Getty said he had been diagnosed with a serious medical condition in 2013. \"A rise in my blood pressure places me in grave risk of substantial and irreparable injury or death,\" he wrote in the petition. \"My doctors have advised that heated arguments can cause my blood pressure to rise dangerously.\" Andrew Getty had three brothers and three half-sisters. People we've lost in 2015. CNN's Doug Criss, Janet DiGiacomo, Mark Mooney, Mike Love, Julie In and Cheri Mossburg contributed to this report.",
    "groundTruthClaims": [
      {
        "claimText": "Andrew Getty, one of the heirs to billions of oil money, has died of natural causes, according to the Los Angeles Police Department.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "The coroner's preliminary assessment suggests no foul play was involved.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Getty, 47, had multiple health issues and an autopsy will be conducted.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "No criminal investigation is underway.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Getty's parents released a statement confirming their son's death and asking for privacy.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Andrew Getty was one of the grandchildren of oil tycoon J. Paul Getty, and the Getty family fortune is estimated to be around $5 billion.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Getty had recently filed for a restraining order against an ex-girlfriend and cited his serious medical condition as a reason.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-summary-03",
    "dataset": "RAGTruth",
    "taskType": "Summary",
    "domain": "RAGTruth Official Corpus (Summary - llama-2-13b-chat)",
    "query": "Summarize the following news within 89 words:\nAndrew Getty, one of the heirs to billions of oil money, appears to have died of natural causes, a Los Angeles Police Department spokesman said. The coroner's preliminary assessment is there was no foul play involved in the death of Getty, grandson of oi...",
    "generatedAnswer": "Andrew Getty, an heir to the Getty oil fortune, died of natural causes, the LA Police Department says. He was found dead at home with some medication present, but no foul play is suspected. Getty had filed for a restraining order against an ex-girlfriend, citing health concerns. His net worth was estimated to be $2.1 billion.",
    "retrievedContext": "[Document: RAGTruth_Summary_Source_15593.txt]\nAndrew Getty, one of the heirs to billions of oil money, appears to have died of natural causes, a Los Angeles Police Department spokesman said. The coroner's preliminary assessment is there was no foul play involved in the death of Getty, grandson of oil tycoon J. Paul Getty, said Detective Meghan Aguilar. Andrew Getty, 47, had \"several health issues,\" Aguilar said, adding that an autopsy will be conducted. There is no criminal investigation underway, he said. Some medication had also been recovered from Getty's home, though investigators don't know whether Getty was taking it or what his medical history was, Ed Winter, assistant chief in the Los Angeles County coroner's office, told CNN affiliate KTLA Tuesday night. KTLA reported that Getty was found on his side near a bathroom in his home. Getty's parents, Ann and Gordon Getty, released a statement confirming their son's death and asking for privacy. Where the Getty family fortune came from. Gordon Getty is one of three living sons of J. Paul Getty, the oil baron who was thought to be the richest man in the world at the time of his death in 1976. Gordon Getty, 81, has a net worth of $2.1 billion, according to Forbes. One other son died in 1958 and another died in 1973. Gordon Getty spearheaded the controversial sale of Getty to Texaco for $10 billion in 1984. In its list of richest American families, Forbes estimated the Gettys' net worth to be about $5 billion. Court records show Andrew Getty had recently filed to get a restraining order against an ex-girlfriend. A hearing in the case had been scheduled for next week. In his request, Getty said he had been diagnosed with a serious medical condition in 2013. \"A rise in my blood pressure places me in grave risk of substantial and irreparable injury or death,\" he wrote in the petition. \"My doctors have advised that heated arguments can cause my blood pressure to rise dangerously.\" Andrew Getty had three brothers and three half-sisters. People we've lost in 2015. CNN's Doug Criss, Janet DiGiacomo, Mark Mooney, Mike Love, Julie In and Cheri Mossburg contributed to this report.",
    "groundTruthClaims": [
      {
        "claimText": "Andrew Getty, an heir to the Getty oil fortune, died of natural causes, the LA Police Department says.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "He was found dead at home with some medication present, but no foul play is suspected.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Getty had filed for a restraining order against an ex-girlfriend, citing health concerns.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      },
      {
        "claimText": "His net worth was estimated to be $2.1 billion.",
        "groundTruthVerdict": "CONTRADICTED",
        "evidenceSnippet": "EVIDENT CONFLICT: Original:  Gordon Getty whose net worth is stated as $2.1 billion. AIGC: Andrew Getty's net worth was estimated to be $2.1",
        "docName": "RAGTruth_Summary_Source_15593.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-summary-04",
    "dataset": "RAGTruth",
    "taskType": "Summary",
    "domain": "RAGTruth Official Corpus (Summary - llama-2-13b-chat)",
    "query": "Summarize the following news within 86 words:\nThe FBI charged a Philadelphia woman on Thursday with trying to travel overseas to fight for ISIS. She's one of three women arrested this week on terror charges. Two New York women were also taken into custody. An FBI complaint cites numerous social medi...",
    "generatedAnswer": "Three women, including Keonna Thomas of Philadelphia, were charged with attempting to join ISIS this week. Thomas purchased a ticket to Barcelona but was arrested before her trip. Two other women, Noelle Velentzas and Asia Siddiqui, were arrested in New York for planning to build an explosive device. The FBI cited social media messages dating back to 2013 as evidence. This brings the total number of US citizens charged with supporting terrorism to over 30 in the past 18 months, with 18 of those cases involving ISIS.",
    "retrievedContext": "[Document: RAGTruth_Summary_Source_15596.txt]\nThe FBI charged a Philadelphia woman on Thursday with trying to travel overseas to fight for ISIS. She's one of three women arrested this week on terror charges. Two New York women were also taken into custody. An FBI complaint cites numerous social media messages dating back to August 2013 that were sent by Keonna Thomas, 30, also known as \"Young Lioness\" and \"Fatayat Al Khilafah.\" One Twitter message said, \"If we truly knew the realities ... we all would be rushing to join our brothers in the front lines pray ALLAH accept us as shuhada [martyrs].\" Another said, \"When you're a mujahid [violent jihadi fighter] your death becomes a wedding.\" The FBI said Thomas purchased an electronic visa to Turkey on March 23. Turkey is known as the easiest place from which to enter Syria and join ISIS. An ISIS manual advises recruits to buy round-trip tickets to vacation spots such as Spain and then purchase tickets for their real destination once they arrive overseas, the FBI said. On March 26, Thomas purchased a ticket to Barcelona, with a March 29 departure and an April 15 return to the United States, the complaint said. It's not clear when or where she was arrested. She was charged with knowingly attempting to provide material support and resources to a designated foreign terrorist organization. She could be sentenced to 15 years in prison. On Thursday, Noelle Velentzas, 28, and her former roommate, Asia Siddiqui, 31, were arrested in New York and accused of planning to build an explosive device for attacks in the United States, federal prosecutors said. In the past 18 months, the Justice Department's National Security Division has prosecuted or is prosecuting more than 30 cases of people attempting to travel abroad to join or provide support to terrorist groups. Of those cases, 18 allegedly involve support to ISIS. \"The terrorist threat is more decentralized, more diffuse, more complicated,\" Homeland Security Secretary Jeh Johnson told reporters Thursday. \"It involves the potential lone wolf actor, it involves the effective use of social media, the Internet.\"",
    "groundTruthClaims": [
      {
        "claimText": "Three women, including Keonna Thomas of Philadelphia, were charged with attempting to join ISIS this week.",
        "groundTruthVerdict": "CONTRADICTED",
        "evidenceSnippet": "EVIDENT CONFLICT: Original: Three women, including Keonna Thomas of Philadelphia, were charged with attempting to join ISIS this week. AIGC: It is Keonna Thomas who is charged of attempting to join ISIS. Meanwhile, the other two were arrested and accused of planning to build an explosive device for attacks in the United States.",
        "docName": "RAGTruth_Summary_Source_15596.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Thomas purchased a ticket to Barcelona but was arrested before her trip.",
        "groundTruthVerdict": "CONTRADICTED",
        "evidenceSnippet": "EVIDENT CONFLICT: Original:  It's not clear when or where she was arrested.  AIGC:was arrested before her trip ",
        "docName": "RAGTruth_Summary_Source_15596.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Two other women, Noelle Velentzas and Asia Siddiqui, were arrested in New York for planning to build an explosive device.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15596.txt",
        "pageNumber": 1
      },
      {
        "claimText": "The FBI cited social media messages dating back to 2013 as evidence.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15596.txt",
        "pageNumber": 1
      },
      {
        "claimText": "This brings the total number of US citizens charged with supporting terrorism to over 30 in the past 18 months, with 18 of those cases involving ISIS.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Summary_Source_15596.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-data2txt-01",
    "dataset": "RAGTruth",
    "taskType": "Data2txt",
    "domain": "RAGTruth Official Corpus (Data2txt - llama-2-7b-chat)",
    "query": "Instruction:\nWrite an objective overview about the following local business based only on the provided structured data in the JSON format. You should include details and cover the information mentioned in the customers' review. The overview should be 100 - 200 words. Don't make up information. Struc...",
    "generatedAnswer": "Apna Indian Kitchen is a highly rated restaurant located in Santa Barbara, California, serving a variety of gluten-free, gastropub, vegan, and Indian cuisine. According to customer reviews, the restaurant offers tasty and authentic Indian food with great service. Customers have praised the menu options, including mixed veg spicy and butter chicken medium spicy dishes, roti, and naan. The restaurant has a cozy atmosphere with outdoor seating and free WiFi. While the restrooms could use some attention, the serving sizes are perfect, and the staff is friendly. Customers have given the restaurant a 4.5-star rating, with many leaving positive reviews highlighting the quality of the food and service.",
    "retrievedContext": "[Document: RAGTruth_Data2txt_Source_13599.txt]\n{\"name\":\"Apna Indian Kitchen\",\"address\":\"718 State St\",\"city\":\"Santa Barbara\",\"state\":\"CA\",\"categories\":\"Gluten-Free, Gastropubs, Vegan, Restaurants, Indian\",\"hours\":{\"Tuesday\":\"16:30-21:0\",\"Wednesday\":\"16:30-21:0\",\"Thursday\":\"16:30-21:0\",\"Friday\":\"16:30-21:0\",\"Saturday\":\"16:30-21:0\",\"Sunday\":\"16:30-21:0\"},\"attributes\":{\"BusinessParking\":null,\"RestaurantsReservations\":true,\"OutdoorSeating\":true,\"WiFi\":\"no\",\"RestaurantsTakeOut\":true,\"RestaurantsGoodForGroups\":true,\"Music\":null,\"Ambience\":{\"divey\":false,\"hipster\":true,\"casual\":true,\"touristy\":null,\"trendy\":null,\"intimate\":null,\"romantic\":null,\"classy\":true,\"upscale\":null}},\"business_stars\":4.5,\"review_info\":[{\"review_stars\":5,\"review_date\":\"2022-01-16 14:45:22\",\"review_text\":\"We ordered mixed veg spicy, butter chicken medium spicy, roti and naan. All were awesome. \\n\\nTasty Food. Great service.\\n\\nRestroom needs some attention\"},{\"review_stars\":5,\"review_date\":\"2022-01-15 04:35:24\",\"review_text\":\"Service was great and food was delicious. The cabbage and slaw are served with most dishes we got, and are nothing we ever been offered at other traditional restaurants, but added a modern twist and lots of flavor to what would be a typical authentic dish.  Serving size is perfect. Definitely returning. \\nWe had the veggie samosas, vegan dal, fish pakora, shrimp tandoori, vegan potato pancakes, and rice. All was so delicious, we destroyed the dishes before we thought to take photos!\"},{\"review_stars\":5,\"review_date\":\"2022-01-15 02:28:06\",\"review_text\":\"Really really solid Indian food. The fish pakora was the absolute star at dinner, but the saag, both paneer and lamb, were outstanding. Naan was also so fresh and really what Naan should be. And the complimentary Chai is a great, delicious touch. Nice people too.\"}]}",
    "groundTruthClaims": [
      {
        "claimText": "Apna Indian Kitchen is a highly rated restaurant located in Santa Barbara, California, serving a variety of gluten-free, gastropub, vegan, and Indian cuisine.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13599.txt",
        "pageNumber": 1
      },
      {
        "claimText": "According to customer reviews, the restaurant offers tasty and authentic Indian food with great service.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13599.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Customers have praised the menu options, including mixed veg spicy and butter chicken medium spicy dishes, roti, and naan.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13599.txt",
        "pageNumber": 1
      },
      {
        "claimText": "The restaurant has a cozy atmosphere with outdoor seating and free WiFi.",
        "groundTruthVerdict": "CONTRADICTED",
        "evidenceSnippet": "EVIDENT CONFLICT Original: \"WiFi\": \"no\", Generative: \"free WiFi.\"",
        "docName": "RAGTruth_Data2txt_Source_13599.txt",
        "pageNumber": 1
      },
      {
        "claimText": "While the restrooms could use some attention, the serving sizes are perfect, and the staff is friendly.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13599.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Customers have given the restaurant a 4.5-star rating, with many leaving positive reviews highlighting the quality of the food and service.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13599.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-data2txt-02",
    "dataset": "RAGTruth",
    "taskType": "Data2txt",
    "domain": "RAGTruth Official Corpus (Data2txt - gpt-4-0613)",
    "query": "Instruction:\nWrite an objective overview about the following local business based only on the provided structured data in the JSON format. You should include details and cover the information mentioned in the customers' review. The overview should be 100 - 200 words. Don't make up information. Struc...",
    "generatedAnswer": "Le Crepe Shoppe is a French restaurant located at 15 W Gutierrez St, Santa Barbara, CA. Specializing in Creperies, this establishment has a casual ambiance and does not provide outdoor seating or play music. It does not offer reservations but does provide takeout services. The shop doesn't offer valet or garage parking, but it has a lot and street parking. It has a 4-star rating, with reviews praising the sweet berry crepes and strawberry rhubarb crepe for their freshness and taste. However, there is a negative review expressing disappointment with the BLT crepe, citing watery ingredients and an unpleasant taste from the buckwheat flour used. The service is reported to be friendly.",
    "retrievedContext": "[Document: RAGTruth_Data2txt_Source_13600.txt]\n{\"name\":\"Le Crepe Shoppe\",\"address\":\"15 W Gutierrez St\",\"city\":\"Santa Barbara\",\"state\":\"CA\",\"categories\":\"French, Creperies, Restaurants\",\"hours\":null,\"attributes\":{\"BusinessParking\":{\"garage\":false,\"street\":true,\"validated\":false,\"lot\":true,\"valet\":false},\"RestaurantsReservations\":false,\"OutdoorSeating\":false,\"WiFi\":null,\"RestaurantsTakeOut\":true,\"RestaurantsGoodForGroups\":false,\"Music\":null,\"Ambience\":{\"romantic\":false,\"intimate\":false,\"touristy\":false,\"hipster\":false,\"divey\":false,\"classy\":false,\"trendy\":false,\"upscale\":false,\"casual\":true}},\"business_stars\":4,\"review_info\":[{\"review_stars\":5,\"review_date\":\"2013-07-16 04:57:13\",\"review_text\":\"Very fresh and tasty, I would come back again for the sweet berry crepes, so good\"},{\"review_stars\":5,\"review_date\":\"2012-07-14 00:15:44\",\"review_text\":\"Delicious strawberry rhubarb crepe, and friendly service in a quaint shop.\"},{\"review_stars\":1,\"review_date\":\"2012-07-12 03:54:09\",\"review_text\":\"I recently had the misfortune of suffering through one of the BLT crepes. The buckwheat flour they used destroyed all the subtle flavors of the crepe, the ingredients were WATERY, the lettuce tasted like it still was coated in pesticides and frankly, it was disgusting. Part way through forcing myself to finish what I had paid for, I literally gagged. I hope others have a better experience than I did!\"}]}",
    "groundTruthClaims": [
      {
        "claimText": "Le Crepe Shoppe is a French restaurant located at 15 W Gutierrez St, Santa Barbara, CA.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Specializing in Creperies, this establishment has a casual ambiance and does not provide outdoor seating or play music.",
        "groundTruthVerdict": "UNSUPPORTED",
        "evidenceSnippet": "HIGH INTRODUCTION OF INFORMATION Original: \"Music\": null, Generative: \"does not provide...play music\"",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "It does not offer reservations but does provide takeout services.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "The shop doesn't offer valet or garage parking, but it has a lot and street parking.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "It has a 4-star rating, with reviews praising the sweet berry crepes and strawberry rhubarb crepe for their freshness and taste.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "However, there is a negative review expressing disappointment with the BLT crepe, citing watery ingredients and an unpleasant taste from the buckwheat flour used.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "The service is reported to be friendly.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-data2txt-03",
    "dataset": "RAGTruth",
    "taskType": "Data2txt",
    "domain": "RAGTruth Official Corpus (Data2txt - mistral-7B-instruct)",
    "query": "Instruction:\nWrite an objective overview about the following local business based only on the provided structured data in the JSON format. You should include details and cover the information mentioned in the customers' review. The overview should be 100 - 200 words. Don't make up information. Struc...",
    "generatedAnswer": "Le Crepe Shoppe is a French-style creperie located at 15 W Gutierrez St in Santa Barbara, California. Based on the provided structured data, it appears that they serve both savory and sweet crepes, with a focus on using fresh and high-quality ingredients. Customers have praised their sweet crepes, specifically mentioning the strawberry rhubarb and sweet berry options. However, some customers have also expressed dissatisfaction with certain menu items, such as the BLT crepe. Overall, based on customer reviews, Le Crepe Shoppe appears to be a casual eatery that offers tasty crepes and a quaint atmosphere, but may not be suitable for those looking for more upscale dining options.",
    "retrievedContext": "[Document: RAGTruth_Data2txt_Source_13600.txt]\n{\"name\":\"Le Crepe Shoppe\",\"address\":\"15 W Gutierrez St\",\"city\":\"Santa Barbara\",\"state\":\"CA\",\"categories\":\"French, Creperies, Restaurants\",\"hours\":null,\"attributes\":{\"BusinessParking\":{\"garage\":false,\"street\":true,\"validated\":false,\"lot\":true,\"valet\":false},\"RestaurantsReservations\":false,\"OutdoorSeating\":false,\"WiFi\":null,\"RestaurantsTakeOut\":true,\"RestaurantsGoodForGroups\":false,\"Music\":null,\"Ambience\":{\"romantic\":false,\"intimate\":false,\"touristy\":false,\"hipster\":false,\"divey\":false,\"classy\":false,\"trendy\":false,\"upscale\":false,\"casual\":true}},\"business_stars\":4,\"review_info\":[{\"review_stars\":5,\"review_date\":\"2013-07-16 04:57:13\",\"review_text\":\"Very fresh and tasty, I would come back again for the sweet berry crepes, so good\"},{\"review_stars\":5,\"review_date\":\"2012-07-14 00:15:44\",\"review_text\":\"Delicious strawberry rhubarb crepe, and friendly service in a quaint shop.\"},{\"review_stars\":1,\"review_date\":\"2012-07-12 03:54:09\",\"review_text\":\"I recently had the misfortune of suffering through one of the BLT crepes. The buckwheat flour they used destroyed all the subtle flavors of the crepe, the ingredients were WATERY, the lettuce tasted like it still was coated in pesticides and frankly, it was disgusting. Part way through forcing myself to finish what I had paid for, I literally gagged. I hope others have a better experience than I did!\"}]}",
    "groundTruthClaims": [
      {
        "claimText": "Le Crepe Shoppe is a French-style creperie located at 15 W Gutierrez St in Santa Barbara, California.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Based on the provided structured data, it appears that they serve both savory and sweet crepes, with a focus on using fresh and high-quality ingredients.",
        "groundTruthVerdict": "UNSUPPORTED",
        "evidenceSnippet": "Original: \"...focus on using fresh and high-quality...\" this does not appear in the original source. ",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Customers have praised their sweet crepes, specifically mentioning the strawberry rhubarb and sweet berry options.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "However, some customers have also expressed dissatisfaction with certain menu items, such as the BLT crepe.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Overall, based on customer reviews, Le Crepe Shoppe appears to be a casual eatery that offers tasty crepes and a quaint atmosphere, but may not be suitable for those looking for more upscale dining options.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-data2txt-04",
    "dataset": "RAGTruth",
    "taskType": "Data2txt",
    "domain": "RAGTruth Official Corpus (Data2txt - llama-2-7b-chat)",
    "query": "Instruction:\nWrite an objective overview about the following local business based only on the provided structured data in the JSON format. You should include details and cover the information mentioned in the customers' review. The overview should be 100 - 200 words. Don't make up information. Struc...",
    "generatedAnswer": "Le Crepe Shoppe is a popular French restaurant located in Santa Barbara, California, known for its delicious crepes made with fresh ingredients. According to customer reviews, the restaurant consistently receives high praise for its sweet crepes, particularly the berry variety. The atmosphere is casual and intimate, making it a great spot for groups. However, some customers have had mixed experiences with the quality of the ingredients, particularly with the use of watery lettuce in one instance. Despite this, the business has a rating of 4.0 stars based on customer reviews.",
    "retrievedContext": "[Document: RAGTruth_Data2txt_Source_13600.txt]\n{\"name\":\"Le Crepe Shoppe\",\"address\":\"15 W Gutierrez St\",\"city\":\"Santa Barbara\",\"state\":\"CA\",\"categories\":\"French, Creperies, Restaurants\",\"hours\":null,\"attributes\":{\"BusinessParking\":{\"garage\":false,\"street\":true,\"validated\":false,\"lot\":true,\"valet\":false},\"RestaurantsReservations\":false,\"OutdoorSeating\":false,\"WiFi\":null,\"RestaurantsTakeOut\":true,\"RestaurantsGoodForGroups\":false,\"Music\":null,\"Ambience\":{\"romantic\":false,\"intimate\":false,\"touristy\":false,\"hipster\":false,\"divey\":false,\"classy\":false,\"trendy\":false,\"upscale\":false,\"casual\":true}},\"business_stars\":4,\"review_info\":[{\"review_stars\":5,\"review_date\":\"2013-07-16 04:57:13\",\"review_text\":\"Very fresh and tasty, I would come back again for the sweet berry crepes, so good\"},{\"review_stars\":5,\"review_date\":\"2012-07-14 00:15:44\",\"review_text\":\"Delicious strawberry rhubarb crepe, and friendly service in a quaint shop.\"},{\"review_stars\":1,\"review_date\":\"2012-07-12 03:54:09\",\"review_text\":\"I recently had the misfortune of suffering through one of the BLT crepes. The buckwheat flour they used destroyed all the subtle flavors of the crepe, the ingredients were WATERY, the lettuce tasted like it still was coated in pesticides and frankly, it was disgusting. Part way through forcing myself to finish what I had paid for, I literally gagged. I hope others have a better experience than I did!\"}]}",
    "groundTruthClaims": [
      {
        "claimText": "Le Crepe Shoppe is a popular French restaurant located in Santa Barbara, California, known for its delicious crepes made with fresh ingredients.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "According to customer reviews, the restaurant consistently receives high praise for its sweet crepes, particularly the berry variety.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "The atmosphere is casual and intimate, making it a great spot for groups.",
        "groundTruthVerdict": "CONTRADICTED",
        "evidenceSnippet": "EVIDENT CONFLICT Original: \"intimate\": false, Generative: \"atmosphere is... intimate\"",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "However, some customers have had mixed experiences with the quality of the ingredients, particularly with the use of watery lettuce in one instance.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Despite this, the business has a rating of 4.0 stars based on customer reviews.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_Data2txt_Source_13600.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-qa-01",
    "dataset": "RAGTruth",
    "taskType": "QA",
    "domain": "RAGTruth Official Corpus (QA - gpt-4-0613)",
    "query": "Briefly answer the following question:\nbutcher shop phone number\nBear in mind that your response should be strictly based on the following three passages:\npassage 1:Butcher Shop - Hayward 826 B Street, Hayward CA 94541 Phone Number: (510) 889-8690\n\npassage 2:Butcher Shop - Lakefield 212 Main Street,...",
    "generatedAnswer": "The phone numbers for several butcher shops are mentioned in the passages. Butcher Shop in Hayward can be reached at (510) 889-8690. Butcher Shop in Lakefield can be contacted at (507) 662-6281. The Local Butcher Shop's number is (510) 845-6328, Boones Butcher Shop can be reached at (502) 348-3668, Ye Ole Butcher Shop's number is (972) 423-1848, and J Ms Butcher Shop's phone number is (865) 483-9228.",
    "retrievedContext": "[Document: RAGTruth_QA_Source_14292.txt]\n{\"question\":\"butcher shop phone number\",\"passages\":\"passage 1:Butcher Shop - Hayward 826 B Street, Hayward CA 94541 Phone Number: (510) 889-8690\\n\\npassage 2:Butcher Shop - Lakefield 212 Main Street, Lakefield MN 56150 Phone Number: (507) 662-6281\\n\\npassage 3:Some More Phone Numbers Related To The Butcher Shop The Local Butcher Shop phone number : (510) 845-6328 Boones Butcher Shop phone number : (502) 348-3668 Ye Ole Butcher Shop phone number : (972) 423-1848 J Ms Butcher Shop phone number : (865) 483-9228\\n\\n\"}",
    "groundTruthClaims": [
      {
        "claimText": "The phone numbers for several butcher shops are mentioned in the passages.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14292.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Butcher Shop in Hayward can be reached at (510) 889-8690.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14292.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Butcher Shop in Lakefield can be contacted at (507) 662-6281.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14292.txt",
        "pageNumber": 1
      },
      {
        "claimText": "The Local Butcher Shop's number is (510) 845-6328, Boones Butcher Shop can be reached at (502) 348-3668, Ye Ole Butcher Shop's number is (972) 423-1848, and J Ms Butcher Shop's phone number is (865) 483-9228.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14292.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-qa-02",
    "dataset": "RAGTruth",
    "taskType": "QA",
    "domain": "RAGTruth Official Corpus (QA - gpt-3.5-turbo-0613)",
    "query": "Briefly answer the following question:\nbutcher shop phone number\nBear in mind that your response should be strictly based on the following three passages:\npassage 1:Butcher Shop - Hayward 826 B Street, Hayward CA 94541 Phone Number: (510) 889-8690\n\npassage 2:Butcher Shop - Lakefield 212 Main Street,...",
    "generatedAnswer": "Butcher Shop - Hayward phone number: (510) 889-8690",
    "retrievedContext": "[Document: RAGTruth_QA_Source_14292.txt]\n{\"question\":\"butcher shop phone number\",\"passages\":\"passage 1:Butcher Shop - Hayward 826 B Street, Hayward CA 94541 Phone Number: (510) 889-8690\\n\\npassage 2:Butcher Shop - Lakefield 212 Main Street, Lakefield MN 56150 Phone Number: (507) 662-6281\\n\\npassage 3:Some More Phone Numbers Related To The Butcher Shop The Local Butcher Shop phone number : (510) 845-6328 Boones Butcher Shop phone number : (502) 348-3668 Ye Ole Butcher Shop phone number : (972) 423-1848 J Ms Butcher Shop phone number : (865) 483-9228\\n\\n\"}",
    "groundTruthClaims": [
      {
        "claimText": "Butcher Shop - Hayward phone number: (510) 889-8690",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14292.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-qa-03",
    "dataset": "RAGTruth",
    "taskType": "QA",
    "domain": "RAGTruth Official Corpus (QA - mistral-7B-instruct)",
    "query": "Briefly answer the following question:\nbutcher shop phone number\nBear in mind that your response should be strictly based on the following three passages:\npassage 1:Butcher Shop - Hayward 826 B Street, Hayward CA 94541 Phone Number: (510) 889-8690\n\npassage 2:Butcher Shop - Lakefield 212 Main Street,...",
    "generatedAnswer": "Based on the given passages, there are several different phone numbers associated with butcher shops. However, none of them are for a specific location named \"bear\" or have any indication of being related to bears. Therefore, it is unable to determine if there is a butcher shop phone number specifically for \"bear\".",
    "retrievedContext": "[Document: RAGTruth_QA_Source_14292.txt]\n{\"question\":\"butcher shop phone number\",\"passages\":\"passage 1:Butcher Shop - Hayward 826 B Street, Hayward CA 94541 Phone Number: (510) 889-8690\\n\\npassage 2:Butcher Shop - Lakefield 212 Main Street, Lakefield MN 56150 Phone Number: (507) 662-6281\\n\\npassage 3:Some More Phone Numbers Related To The Butcher Shop The Local Butcher Shop phone number : (510) 845-6328 Boones Butcher Shop phone number : (502) 348-3668 Ye Ole Butcher Shop phone number : (972) 423-1848 J Ms Butcher Shop phone number : (865) 483-9228\\n\\n\"}",
    "groundTruthClaims": [
      {
        "claimText": "Based on the given passages, there are several different phone numbers associated with butcher shops.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14292.txt",
        "pageNumber": 1
      },
      {
        "claimText": "However, none of them are for a specific location named \"bear\" or have any indication of being related to bears.",
        "groundTruthVerdict": "UNSUPPORTED",
        "evidenceSnippet": "HIGH INTRO OF NEW INFO No mention of this in the passages and original answer. ",
        "docName": "RAGTruth_QA_Source_14292.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Therefore, it is unable to determine if there is a butcher shop phone number specifically for \"bear\".",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14292.txt",
        "pageNumber": 1
      }
    ]
  },
  {
    "id": "case-ragtruth-qa-04",
    "dataset": "RAGTruth",
    "taskType": "QA",
    "domain": "RAGTruth Official Corpus (QA - mistral-7B-instruct)",
    "query": "Briefly answer the following question:\nwhat is the difference between single cream and double cream\nBear in mind that your response should be strictly based on the following three passages:\npassage 1:In Britain, single cream refers to a milk product that has between 10 percent and 12 percent butterf...",
    "generatedAnswer": "Based on the given passages, we can say that the primary difference between single cream and double cream in Britain is the butterfat content. Single cream has between 10% and 12%, which creates a thin liquid similar to half and half. On the other hand, double cream contains 48% butterfat and is therefore thicker. Additionally, the fat content makes double cream suitable for whipping whereas single cream cannot be easily whipped. Single cream also has a higher binding ability due to its higher fat content. Therefore, for cooking purposes, if you want a thinner consistency and do not need whipping capabilities, single cream would be more suitable. However, if you need a thicker consistency and require whipping capabilities, double cream would be a better option.",
    "retrievedContext": "[Document: RAGTruth_QA_Source_14295.txt]\n{\"question\":\"what is the difference between single cream and double cream\",\"passages\":\"passage 1:In Britain, single cream refers to a milk product that has between 10 percent and 12 percent butterfat.This relatively low level of butterfat creates a thin liquid similar to the U.S. product called half and half. In contrast, double cream in Britain refers to a cream product containing 48 percent butterfat.n Britain, single cream refers to a milk product that has between 10 percent and 12 percent butterfat.\\n\\npassage 2:Whipping. Because of its high milk content, single cream is too thin to be whipped into soft or hard peaks. Double cream, however, is an excellent cream for whipping. It whips quickly into soft and then hard peaks. Some cooks find that double cream is so thick it strains their mixer.n Britain, single cream refers to a milk product that has between 10 percent and 12 percent butterfat.\\n\\npassage 3:Report Abuse. Double cream has a higher fat content than single. You can use it in cooking but you will generally need rather less to get the same results. Because of the higher fat content it will bind with the flour ion the pasta to produce a thicker sauce.E: In cooking, what is the difference between double & single cream? For making my home-made macaroni m cheese-what should I use to coat the pasta-double cream or single cream? I used double before and it tasted really good, but dont know the difference between the two for cooking purposes.\\n\\n\"}",
    "groundTruthClaims": [
      {
        "claimText": "Based on the given passages, we can say that the primary difference between single cream and double cream in Britain is the butterfat content.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14295.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Single cream has between 10% and 12%, which creates a thin liquid similar to half and half.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14295.txt",
        "pageNumber": 1
      },
      {
        "claimText": "On the other hand, double cream contains 48% butterfat and is therefore thicker.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14295.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Additionally, the fat content makes double cream suitable for whipping whereas single cream cannot be easily whipped.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14295.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Single cream also has a higher binding ability due to its higher fat content.",
        "groundTruthVerdict": "CONTRADICTED",
        "evidenceSnippet": "EVIDENT CONFLICT Original: Double cream has a higher fat content ... it will bind with the flour to produce a thicker sauce AIGC: Single cream also has a higher binding quality",
        "docName": "RAGTruth_QA_Source_14295.txt",
        "pageNumber": 1
      },
      {
        "claimText": "Therefore, for cooking purposes, if you want a thinner consistency and do not need whipping capabilities, single cream would be more suitable.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14295.txt",
        "pageNumber": 1
      },
      {
        "claimText": "However, if you need a thicker consistency and require whipping capabilities, double cream would be a better option.",
        "groundTruthVerdict": "SUPPORTED",
        "evidenceSnippet": "Ground truth source context passage verified.",
        "docName": "RAGTruth_QA_Source_14295.txt",
        "pageNumber": 1
      }
    ]
  }
];

export const ACADEMIC_BENCHMARK_CASES: BenchmarkCase[] = [
  {
    id: "case-academic-01",
    dataset: "AcademicDomain",
    domain: "College Attendance & Exam Policy",
    query: "What is the minimum attendance requirement for semester exams and can I pay a fine if my attendance is between 65% and 75%?",
    generatedAnswer: "The minimum attendance required to appear for the semester examination is 75%. If your attendance falls between 65% and 75%, you can pay a monetary fine to the institute examination cell to sit for the exam.",
    retrievedContext: "[Examination_&_Attendance_Policy.pdf - Page 1]\n1.1 General Rule: Students must maintain a minimum mandatory attendance of 75% in every registered course to be eligible to appear in the End-Semester Examinations.\n1.2 Medical / Condonation Exemption: Attendance up to 10% (i.e. between 65% and 74.9%) may be condoned by the Director on medical grounds or official institute deputation, provided valid documentary evidence is submitted within 3 working days of absence.\n1.4 Note on Fines: The institute DOES NOT permit any monetary fine or fee payment in lieu of attendance shortage. Attendance cannot be purchased or relaxed by paying fees or fines.",
    groundTruthClaims: [
      {
        claimText: "Minimum attendance required for semester exams is 75%.",
        groundTruthVerdict: "SUPPORTED",
        evidenceSnippet: "1.1 General Rule: Students must maintain a minimum mandatory attendance of 75% in every registered course...",
        docName: "Examination_&_Attendance_Policy.pdf",
        pageNumber: 1
      },
      {
        claimText: "Students with 65-75% attendance can pay a monetary fine to the exam cell to appear for the exam.",
        groundTruthVerdict: "CONTRADICTED",
        evidenceSnippet: "1.4 Note on Fines: The institute DOES NOT permit any monetary fine or fee payment in lieu of attendance shortage.",
        docName: "Examination_&_Attendance_Policy.pdf",
        pageNumber: 1
      }
    ]
  },
  {
    id: "case-academic-02",
    dataset: "AcademicDomain",
    domain: "Academic Credit & Degree Requirements",
    query: "How many total credits are required for a B.Tech degree, and what is the maximum credit limit allowed per semester?",
    generatedAnswer: "To graduate with a B.Tech degree, a student must complete 160 credits. The normal semester load is 20-24 credits, but students can register up to 28 credits with Dean approval. Furthermore, students with CPI above 9.0 can register for up to 32 credits.",
    retrievedContext: "[Academic_Regulations_2025-26.pdf - Page 1]\n1.2 Total Credit Requirement: A student must successfully complete a minimum of 160 credits to be eligible for the award of B.Tech degree.\n1.3 Normal Course Load: The standard course load per semester is between 20 and 24 credits. No student shall be permitted to register for more than 28 credits in a single semester without prior approval from the Academic Dean.",
    groundTruthClaims: [
      {
        claimText: "Total credit requirement for B.Tech degree is 160 credits.",
        groundTruthVerdict: "SUPPORTED",
        evidenceSnippet: "1.2 Total Credit Requirement: A student must successfully complete a minimum of 160 credits...",
        docName: "Academic_Regulations_2025-26.pdf",
        pageNumber: 1
      },
      {
        claimText: "Standard semester course load is between 20 and 24 credits, up to 28 with Dean approval.",
        groundTruthVerdict: "SUPPORTED",
        evidenceSnippet: "1.3 Normal Course Load: The standard course load per semester is between 20 and 24 credits... max 28 with prior approval.",
        docName: "Academic_Regulations_2025-26.pdf",
        pageNumber: 1
      },
      {
        claimText: "Students with CPI above 9.0 can register for up to 32 credits per semester.",
        groundTruthVerdict: "UNSUPPORTED",
        evidenceSnippet: "No mention of 32 credits or CPI 9.0 exemption in regulations.",
        docName: "None",
        pageNumber: 0
      }
    ]
  },
  {
    id: "case-academic-03",
    dataset: "AcademicDomain",
    domain: "Campus Placement & Job Offers",
    query: "What is the CPI cutoff for campus placement, and if I get an offer can I apply for other companies?",
    generatedAnswer: "Students must have a minimum aggregate CPI of 6.50 at the end of 6th semester with no active backlogs. Once placed, a student cannot apply for any other company under any circumstances as per the strict one-job policy.",
    retrievedContext: "[Placement_&_Internship_Guidelines.pdf - Page 1 & 2]\n1.1 Academic Cutoff: Students must have a minimum aggregate CPI of 6.50 at the end of the 6th semester with NO active backlogs to participate in campus placement drives.\n2.1 Dream Offer Exemption: Once a student receives a placement offer, they are deemed placed and debarred from subsequent campus drives, EXCEPT for companies designated as \x27Dream Offers\x27 (Package >= 15 LPA) or \x27Super Dream Offers\x27 (Package >= 25 LPA).",
    groundTruthClaims: [
      {
        claimText: "Minimum aggregate CPI required for campus placement is 6.50 with no active backlogs.",
        groundTruthVerdict: "SUPPORTED",
        evidenceSnippet: "1.1 Academic Cutoff: Students must have a minimum aggregate CPI of 6.50...",
        docName: "Placement_&_Internship_Guidelines.pdf",
        pageNumber: 1
      },
      {
        claimText: "Once placed, a student cannot apply for any other company under any circumstances.",
        groundTruthVerdict: "CONTRADICTED",
        evidenceSnippet: "2.1 Dream Offer Exemption: ...debarred from subsequent campus drives, EXCEPT for companies designated as Dream Offers (>=15 LPA) or Super Dream Offers (>=25 LPA).",
        docName: "Placement_&_Internship_Guidelines.pdf",
        pageNumber: 2
      }
    ]
  }
];

export const BENCHMARK_CASES: BenchmarkCase[] = [
  ...RAGTRUTH_BENCHMARK_CASES,
  ...ACADEMIC_BENCHMARK_CASES
];

export function getBenchmarkCases(filter: string): BenchmarkCase[] {
  if (filter === "RAGTruth") {
    return RAGTRUTH_BENCHMARK_CASES;
  }
  if (filter === "AcademicDomain") {
    return ACADEMIC_BENCHMARK_CASES;
  }
  if (filter === "QA" || filter === "Summary" || filter === "Data2txt") {
    return RAGTRUTH_BENCHMARK_CASES.filter(c => c.taskType === filter);
  }
  return BENCHMARK_CASES;
}

