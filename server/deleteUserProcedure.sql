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

END $$