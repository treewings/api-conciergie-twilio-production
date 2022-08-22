CREATE DEFINER=`root`@`localhost` TRIGGER TRG_CREATE_SURVEY AFTER UPDATE
ON concierge_prd.request_outs FOR EACH ROW
BEGIN
  DECLARE v_movement int;
  DECLARE done INT DEFAULT FALSE;
  DECLARE c_movements CURSOR FOR
  select
  sub_menus.id submenu_id
  from movements, menus, sub_menus
  where
  movements.status_movement_id = 7
  and movements.id in (new.branches_movement)
  and menus.id = movements.menu_id
  and sub_menus.id = movements.sub_menu_id;

  DECLARE
    CONTINUE HANDLER FOR NOT FOUND
  SET
      done = TRUE;
  IF (new.type_request_id = 1 AND new.return_content is not null) THEN
    OPEN c_movements;
    movement_loop:
    LOOP
      FETCH c_movements INTO v_movement;

    IF done THEN LEAVE movement_loop;
    END IF;

      INSERT INTO CONCIERGE_PRD.SURVEYS
        ( `request_outs_id` )
      VALUES
        (new.id);

    END LOOP movement_loop;

  END IF;

END
