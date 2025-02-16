CREATE OR REPLACE FUNCTION public.write_new_project_post(title text, content text, images json, tags text[], project_id bigint, type text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$DECLARE
    new_post_id INT;
    author_id UUID;
    tag_name TEXT;
BEGIN
    SELECT auth.uid() INTO author_id;
    
    -- Insert new post with the additional type parameter
    INSERT INTO posts (title, content, images, flairs, project, type)
    VALUES (title, content, images, tags, project_id, type)
    RETURNING id INTO new_post_id;

    -- Update author list_posts
    UPDATE profiles
    SET list_posts = array_append(list_posts, new_post_id)
    WHERE id = author_id;

    -- Update tag list_posts
    FOREACH tag_name IN ARRAY tags LOOP
        UPDATE tags
        SET list_posts = array_append(list_posts, new_post_id)
        WHERE name = tag_name;
    END LOOP;

    -- Upvote post by default
    PERFORM toggle_post_vote(new_post_id, TRUE);

    RETURN new_post_id;
END;
$function$;


-- Current function:
DECLARE
    new_post_id INT;
    author_id UUID;
    tag_name TEXT;
BEGIN
    SELECT auth.uid() INTO author_id;
    
    -- Insert new post
    INSERT INTO posts (title, content, images, flairs, project)
    VALUES (title, content, images, tags, project_id)
    RETURNING id INTO new_post_id;

    -- Update author list_posts
    UPDATE profiles
    SET list_posts = array_append(list_posts, new_post_id)
    WHERE id = author_id;

    -- Update tag list_posts
    FOREACH tag_name IN ARRAY tags LOOP
        UPDATE tags
        SET list_posts = array_append(list_posts, new_post_id)
        WHERE name = tag_name;
    END LOOP;

    -- Upvote post by default
    PERFORM toggle_post_vote(new_post_id, TRUE);

    RETURN new_post_id;
END;