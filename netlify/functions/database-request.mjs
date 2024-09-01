

  import supabase from '../../src/utils/supabase.js'
  // Our standard serverless handler function
  exports.handler = async (event, context) => {
    const { action, table, col, val } = event.queryStringParameters;
    let res;
    switch(action) {
      case "get" : res   = await supabase
        .from(table)
        .select(col);
        break;
      case "check" : res   = await supabase
        .from(table)
        .select(col)
        .eq("id",val)
        break;        
    }
  
    
    return {
      statusCode: 200,
      body: JSON.stringify(res)
    }
  }