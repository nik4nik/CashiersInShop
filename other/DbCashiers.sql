CREATE TABLE work_shift_type
(
    Id SMALLSERIAL PRIMARY KEY,
	StartTime Time NOT NULL,
	EndTime Time NOT NULL,
	Name CHARACTER VARYING(30) UNIQUE NOT NULL
);

CREATE TABLE cash_registers
(
    Id SMALLSERIAL PRIMARY KEY
);

CREATE TABLE cashiers
(
    Id SMALLSERIAL PRIMARY KEY,
    Name CHARACTER VARYING(60) NOT NULL,
    Email CHARACTER VARYING(30) UNIQUE CHECK(Email !='') NOT NULL,
	DateOfBirth DATE NOT NULL,
	Sex CHARACTER VARYING(6) NOT NULL
);

CREATE TABLE shops
(
    Id SMALLSERIAL PRIMARY KEY,
    Name CHARACTER VARYING(30) NOT NULL,
    Address CHARACTER VARYING(30) NOT NULL,
	ATBNetwork BOOLEAN DEFAULT false
);

CREATE TABLE cash_desks2shops
(
    Id SMALLSERIAL PRIMARY KEY,
	CashRegister Integer REFERENCES cash_registers (Id) ON DELETE CASCADE NOT NULL,
	Shop Integer REFERENCES shops (Id) ON DELETE CASCADE NOT NULL,
    Number smallint NOT NULL
);

CREATE TABLE work_shifts
(
    Id SERIAL PRIMARY KEY,
	Date Date NOT NULL,
	Cashier Integer REFERENCES cashiers (Id) ON DELETE CASCADE NOT NULL,
	CashRegister Integer REFERENCES cash_registers (Id) ON DELETE CASCADE NOT NULL,
	WorkShiftType Integer REFERENCES work_shift_type (Id) ON DELETE CASCADE NOT NULL,
	Shop Integer REFERENCES shops (Id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE cashiers2shops
(
    Id SMALLSERIAL PRIMARY KEY,
    Cashier Integer REFERENCES cashiers (Id) ON DELETE CASCADE NOT NULL,
    shop Integer REFERENCES shops (Id) ON DELETE CASCADE NOT NULL,
	StartDate Date NOT NULL,
	EndDate Date
);

INSERT INTO work_shift_type (StartTime, EndTime, Name)
VALUES
('07:00', '15:00', 'first'),
('15:00', '23:00', 'second'),
('23:00', '07:00', 'night');

INSERT INTO shops (Name, Address, ATBNetwork)
VALUES
('АТБ1', 'ул. Шевенка 100', true),
('АТБ2', 'ул. Джугашвили 1', true),
('АТБ3', 'ул. Бронштейна 2', true),
('Arsen', 'ул. Розенфельда 3', false),
('Novus', 'ул. Радомысльского 4', false),
('Silpo', 'ул. Бухарина 5', false);

INSERT INTO cashiers (Name, Email)
VALUES
('Арманд Инесса',		'Armand@gmail.com'),
('Залкинд Розалия', 	'Zalkind@gmail.com'),
('Коллонтай Александра','Kollantai@gmail.com'),
('Каплан Фанни',		'Kaplan@gmail.com'),
('Крупская Надежда',	'Krupskaya@gmail.com'),
('Рейснер Лариса',		'Reisner@gmail.com');

INSERT INTO cashiers2shops (Cashier, Shop, StartDate, EndDate)
VALUES
(1, 1, '03.05.2020', null),
(1, 2, '03.05.2018', '03.05.2020'),
(1, 3, '03.05.2010', '03.05.2018'),
(2, 1, '03.05.2020', null),
(2, 4, '03.05.2018', '03.05.2020'),
(2, 2, '03.05.2010', '03.05.2018'),
(3, 1, '03.05.2020', null),
(3, 3, '03.05.2018', '03.05.2020'),
(3, 5, '03.05.2010', '03.05.2018'),
(4, 1, '03.05.2020', null),
(4, 2, '03.05.2018', '03.05.2020'),
(4, 5, '03.05.2010', '03.05.2018'),
(5, 1, '03.05.2020', null),
(5, 2, '03.05.2018', '03.05.2020'),
(5, 6, '03.05.2010', '03.05.2018'),
(6, 1, '03.05.2020', null),
(6, 2, '03.05.2018', '03.05.2020'),
(6, 6, '03.05.2010', '03.05.2018');

INSERT INTO cash_registers (id)
VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18);

INSERT INTO cash_desks2shops (CashRegister, Shop, Number)
VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 2, 1),
(5, 2, 2),
(6, 2, 3),
(7, 3, 1),
(8, 3, 2),
(9, 3, 3),
(10, 4, 1),
(11, 4, 2),
(12, 4, 3),
(13, 5, 1),
(14, 5, 2),
(15, 5, 3),
(16, 6, 1),
(17, 6, 2),
(18, 6, 3);

INSERT INTO work_shifts (Date, Cashier, CashRegister, WorkShiftType, Shop)
VALUES
('01.02.2021', 1, 1, 1, 1),
('01.02.2021', 2, 2, 2, 1),
('01.02.2021', 3, 1, 3, 1),
('02.02.2021', 4, 2, 1, 1),
('02.02.2021', 5, 1, 2, 1),
('02.02.2021', 6, 2, 3, 1),
('03.02.2021', 1, 1, 1, 1),
('03.02.2021', 2, 2, 2, 1),
('03.02.2021', 3, 1, 3, 1),
('04.02.2021', 4, 2, 1, 1),
('04.02.2021', 5, 1, 2, 1),
('04.02.2021', 6, 2, 3, 1),
('05.02.2021', 1, 1, 1, 1),
('05.02.2021', 2, 2, 2, 1),
('05.02.2021', 3, 1, 3, 1),
('06.02.2021', 4, 2, 1, 1),
('06.02.2021', 5, 1, 2, 1),
('06.02.2021', 6, 2, 3, 1);