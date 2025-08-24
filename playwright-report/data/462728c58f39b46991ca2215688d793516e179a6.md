# Page snapshot

```yaml
- region "Notifications alt+T"
- main
- dialog "Edit Recipe":
  - heading "Edit Recipe" [level=2]
  - paragraph: Update your recipe details and in-stock ingredients.
  - text: Recipe Name *
  - textbox "Recipe Name *": Updated Recipe Name
  - text: Servings
  - spinbutton "Servings": "4"
  - text: Total Time (min)
  - spinbutton "Total Time (min)": "35"
  - text: Tags
  - button "Select tags...":
    - text: Select tags...
    - img
  - paragraph: Organize your recipes with tags like "paleo", "gluten-free", "breakfast", "main-dish", etc.
  - text: Instructions *
  - textbox "Instructions *": "1. Prepare cauliflower rice: Heat oil in large skillet. Add riced cauliflower and salt. Cook 5-7 minutes until softened. Remove and set aside. 2. Cook chicken: Heat remaining oil in same skillet. Add diced chicken and cook 5-7 minutes until golden and cooked through. Remove and set aside. 3. Sauté aromatics: Add garlic and ginger to pan. Cook 30 seconds until fragrant. 4. Add vegetables: Add red bell pepper and white parts of green onion. Cook 2-3 minutes until softened. Add pineapple and cook 1 minute. 5. Scramble eggs: Push vegetables to one side, pour in beaten eggs. Scramble until cooked, then stir with vegetables. 6. Combine everything: Add cauliflower rice, chicken, coconut aminos, and cashews. Stir-fry 2-3 minutes until heated through. 7. Season and serve: Season with salt and pepper. Garnish with green onion tops."
  - text: Notes
  - textbox "Notes"
  - text: Select Ingredients * (in-stock only)
  - button "Search and select in-stock ingredients...":
    - text: Search and select in-stock ingredients...
    - img
  - button "Cancel"
  - button "Update Recipe"
  - button "Close":
    - img
    - text: Close
```