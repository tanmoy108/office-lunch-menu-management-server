CREATE TABLE menu(
    id UUID NOT NULL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(100),
    quantity INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE
)

ALTER TABLE menu ADD CHECK(type='Veg' OR type='NonVeg' OR type='Beverage' OR type='Normal');