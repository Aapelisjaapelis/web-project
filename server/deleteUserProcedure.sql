CREATE PROCEDURE deleteAccount(userid INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
BEGIN
DELETE FROM review
WHERE account_id=userid;
DELETE FROM favorites
WHERE account_id=userid;
DELETE FROM group_invites
WHERE account_id=userid;
DELETE FROM account_moviegroup
WHERE account_id=userid;
DELETE FROM account
WHERE account_id=userid;

END $$;

CREATE PROCEDURE deleteGroup (group_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
DELETE FROM group_invites WHERE moviegroup_id = group_id;
DELETE FROM group_movies WHERE moviegroup_id = group_id;
DELETE FROM account_moviegroup WHERE moviegroup_id = group_id;
DELETE FROM moviegroup WHERE id = group_id;

END;
$$;
