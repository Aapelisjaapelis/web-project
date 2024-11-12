drop table if exists account;
drop table if exists movie;
drop table if exists favorites;
drop table if exists review;
drop table if exists moviegroup;
drop table if exists account_moviegroup;
drop table if exists group_movies;
drop table if exists group_invites;

create table account (
    account_id serial primary key,
    username varchar(50) not null unique,
    email varchar(50) not null unique,
    password varchar(255) not null,
    is_public boolean not null
);

create table moviegroup (
    moviegroup_id serial primary key,
    group_name varchar(50) not null
);

create table favorites (
    favorites_id serial primary key,
    account_id serial not null,
    movie_id serial not null,
    foreign key (account_id) references account(id),
    foreign key (movie_id) references movie(id)
);

create table review (
    review_id serial primary key,
    account_id serial not null,
    movie_id serial not null,
    rating int not null,
    review_text varchar,
    timestamp timestamp default current_timestamp,
    foreign key (account_id) references account(id),
    foreign key (movie_id) references movie(id)
);

create table account_moviegroup (
    account_id serial not null,
    moviegroup_id serial not null,
    is_admin boolean not null,
    foreign key (account_id) references account(id),
    foreign key (moviegroup_id) references moviegroup(id)
);

create table group_invites (
    invite_id serial primary key,
    admin_accepted boolean not null,
    user_accepted boolean not null,
    account_id serial not null,
    moviegroup_id serial not null,
    foreign key (account_id) references account(id),
    foreign key (moviegroup_id) references moviegroup(id)
);

create table group_movies (
    group_movies_id serial primary key,
    moviegroup_id serial not null,
    movie_id serial not null,
    finnkino_id serial not null,
    foreign key (moviegroup_id) references moviegroup(id),
    foreign key (movie_id) references movie(id)
);