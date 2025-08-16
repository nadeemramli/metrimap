// Test script to verify node creation is working
// Run this with: node test-node-creation.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixqjqjqjqjqjqjqjqjqj.supabase.co'; // Replace with your URL
const supabaseKey = 'your-anon-key'; // Replace with your anon key

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNodeCreation() {
  try {
    console.log('🧪 Testing node creation...');
    
    // Test creating an action node
    const { data: actionNodeId, error: actionError } = await supabase.rpc('create_action_node', {
      p_project_id: 'test-project-id',
      p_title: 'Test Action Node',
      p_description: 'Test description',
      p_action_type: 'Initiative',
      p_status: 'Planning',
      p_priority: 'Medium',
      p_assignee: null,
      p_due_date: null,
      p_effort: 0,
      p_tags: ['test'],
      p_position_x: 100.0,
      p_position_y: 100.0,
      p_created_by: 'test-user'
    });

    if (actionError) {
      console.error('❌ Action node creation failed:', actionError);
    } else {
      console.log('✅ Action node created:', actionNodeId);
    }

    // Test creating a hypothesis node
    const { data: hypothesisNodeId, error: hypothesisError } = await supabase.rpc('create_hypothesis_node', {
      p_project_id: 'test-project-id',
      p_title: 'Test Hypothesis Node',
      p_description: 'Test hypothesis description',
      p_hypothesis_type: 'Factor',
      p_confidence: 'Medium',
      p_testable: false,
      p_assumptions: ['assumption1'],
      p_success_criteria: ['criteria1'],
      p_tags: ['test'],
      p_position_x: 200.0,
      p_position_y: 200.0,
      p_created_by: 'test-user'
    });

    if (hypothesisError) {
      console.error('❌ Hypothesis node creation failed:', hypothesisError);
    } else {
      console.log('✅ Hypothesis node created:', hypothesisNodeId);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNodeCreation();
