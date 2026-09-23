# Common Collections Page
## Requirements
1. Page URL: collections
2. Logged or not logged users can access this page
3. Page Structure
   1. Search Bar for searching the entire platform collections and cards names
   2. Relevant Collection a max 3x3 Grid 
   3. All Collections
      1. Should display all Parent Categories and it's children sub-categories as ul lists 
      2. When user click on parent category or sub category redirects to new page with with url 's/categoryid' 
      
# Category Page
## Requirements
1. Page URL: s/:categoryId
2. Fetch Category
3. Page Structure
   1. Search bar to search any collection or card related to this category
   2. In case category is parent category 
      1. Display Relevant Collection a max 3x3 Grid
      2. Display All Sub categories in 3 columns grid 
   3. In Case category is sub-category
      1. Display All Collections under this sub-category 
# General Requirements 
All Categories need a new field called slug and is used to be in url instead database id column