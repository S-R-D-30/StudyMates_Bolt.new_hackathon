/*
  # Fix Community Members RLS Policies

  1. Security Changes
    - Remove recursive RLS policies that cause infinite recursion
    - Simplify community member access policies
    - Fix circular dependencies in policy evaluation

  2. Policy Updates
    - Replace complex recursive policies with simpler, direct policies
    - Ensure policies don't reference themselves or create loops
    - Maintain proper access control without recursion
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read community members" ON community_members;

-- Create new simplified policies for community_members
CREATE POLICY "Members can read community members of public communities"
  ON community_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM communities 
      WHERE communities.id = community_members.community_id 
      AND communities.is_private = false
    )
  );

CREATE POLICY "Members can read community members of their own communities"
  ON community_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM communities 
      WHERE communities.id = community_members.community_id 
      AND communities.creator_id = auth.uid()
    )
    OR
    community_members.user_id = auth.uid()
  );

-- Also fix the communities policies to avoid recursion
DROP POLICY IF EXISTS "Members can view private communities" ON communities;

CREATE POLICY "Members can view private communities they belong to"
  ON communities
  FOR SELECT
  TO authenticated
  USING (
    (is_private = false) 
    OR 
    (creator_id = auth.uid())
    OR
    (is_private = true AND id IN (
      SELECT community_id FROM community_members WHERE user_id = auth.uid()
    ))
  );