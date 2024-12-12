drop table if exists account cascade;
drop table if exists favorites cascade;
drop table if exists review cascade;
drop table if exists moviegroup cascade;
drop table if exists account_moviegroup cascade;
drop table if exists group_movies cascade;
drop table if exists group_invites cascade;

create table account (
    account_id serial primary key,
    username varchar(50) not null unique,
    email varchar(50) not null unique,
    password varchar(255) not null,
    is_public boolean not null
);

create table moviegroup (
    id serial primary key,
    group_name varchar(50) not null,
    group_desc varchar(255)

);

create table favorites (
    id serial primary key,
    account_id serial not null,
    movie_id int not null,
    movie_name varchar(100) not null,
    poster_path varchar(100),
    foreign key (account_id) references account(account_id)
);

create table review (
    id serial primary key,
    account_id serial not null,
    movie_id int not null,
    rating int not null,
    review_text varchar,
    timestamp timestamp default current_timestamp,
    foreign key (account_id) references account(account_id)
);

create table account_moviegroup (
    account_id serial not null,
    moviegroup_id serial not null,
    is_admin boolean not null,
    foreign key (account_id) references account(account_id),
    foreign key (moviegroup_id) references moviegroup(id)
);

create table group_invites (
    id serial primary key,
    admin_accepted boolean not null,
    user_accepted boolean not null,
    account_id serial not null,
    moviegroup_id serial not null,
    foreign key (account_id) references account(account_id),
    foreign key (moviegroup_id) references moviegroup(id)
);

create table group_movies (
    id serial primary key,
    moviegroup_id serial not null,
    movie_id int not null,
    movie_name varchar(100) not null,
    finnkino_movie_id serial not null,
    finnkino_time_id serial not null,
    foreign key (moviegroup_id) references moviegroup(id)
);
