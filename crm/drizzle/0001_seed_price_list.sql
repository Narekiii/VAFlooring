-- Standard property-management price list (material + installation), supplied by V & A Flooring, November 2026.
INSERT INTO "price_items" ("account_id", "code", "name", "description", "unit", "rate_cents", "sort") VALUES
  (NULL, 'lvp-8mm', 'Luxury Vinyl Plank', '8mm click with attached pad. Material + installation', 'sqft', 385, 10),
  (NULL, 'laminate', 'Laminate Flooring', 'Material + installation', 'sqft', 399, 20),
  (NULL, 'fha-carpet', 'FHA Carpet', 'Material + installation', 'sqft', 199, 30),
  (NULL, 'baseboard', 'Baseboard Moldings', 'Material + installation', 'lf', 225, 40);
