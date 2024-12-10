
insert into favorites (account_id, movie_id) values('1','912649');
insert into moviegroup (group_name, group_desc) values ('Akut', 'Elokuvia akuille');
insert into review (account_id, movie_id, rating, review_text) values('1', '912649', '4', 'It was good movie');
insert into account_moviegroup (account_id, moviegroup_id, is_admin) values('1', '1', 'True');


insert into moviegroup (group_name, group_desc) values ('Marvel', 'Only Marvel fans');
insert into moviegroup (group_name, group_desc) values ('MEga suber boom XD', 'Action lovers');
insert into moviegroup (group_name, group_desc) values ('Movie enjoyers', 'oiefioahoihsohgioerhgiorehisoghorehghreohgoierhigohwiofio');


insert into account_moviegroup (account_id, moviegroup_id, is_admin) values('2', '1', 'False');
insert into account_moviegroup (account_id, moviegroup_id, is_admin) values('3', '1', 'False');

insert into account_moviegroup (account_id, moviegroup_id, is_admin) values('2', '2', 'True');


insert into account_moviegroup (account_id, moviegroup_id, is_admin) values('2', '3', 'True');
insert into account_moviegroup (account_id, moviegroup_id, is_admin) values('3', '3', 'False');


insert into account_moviegroup (account_id, moviegroup_id, is_admin) values('1', '4', 'True');


INSERT INTO group_movies(moviegroup_id, movie_name, finnkino_id, finnkino_eventid) VALUES (1, 'Solo Leveling ReAwakening','2148101' ,'304845');
INSERT INTO group_movies(moviegroup_id, movie_name, finnkino_id, finnkino_eventid) VALUES (1, 'Viimeiset päivät','2148051','304764' );