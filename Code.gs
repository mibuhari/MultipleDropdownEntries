function onOpen(e) {								
	SpreadsheetApp.getUi()								
	.createMenu('Multiple Dropdown')
	.addItem('Show dialog', 'showDialog')								
	.addToUi();								
}

function onEdit(e){
  //SpreadsheetApp.getUi().prompt(e.range.getA1Notation());
  if(e.source.getActiveSheet().getName() == "Remarks" ) 
  {
    var locationIndex = "Remarks!" + e.range.getA1Notation();
    // selection of a range of cells
    //Remarks!A1 ... Remarks!A1:A3
    if(locationIndex.indexOf(":")>0)
    {
     locationIndex = "Score!" + locationIndex.substring(locationIndex.indexOf("!",1)+1);
     SpreadsheetApp.getActiveSpreadsheet().getRange(locationIndex).setValue(0);
    }
    else
     sumAmounts(locationIndex);
  }
}

function sumAmounts(index) {
  let nums = [];
  var cellName = index.substring(index.indexOf("!",1)+1);
  // Remarks!A1 is made as Remarks!A1:A1
  index = index + ":" + index.substring(index.indexOf("!",1)+1);
  var str = SpreadsheetApp.getActiveSpreadsheet().getRange(index).getValues();
  //const text = "text1 \\(text2\\)";
  //SpreadsheetApp.getUi().prompt(str[0][0].findText(text));
  str = str[0][0].split(/[(.*?)]/i);
  //str = str.split(".");
  sum = 0;
  for (i = 1; i < str.length; i=i+2)
  {
    // SpreadsheetApp.getUi().prompt("str:" + str[i]);
     sum = sum + Number(str[i]);
  }
//     const s =str[0][0].split("");
//     let sum = s.reduce((a,c) => {
//        if(c.match(/\d/)) {//matches [0-9]
//           Logger.log(Number(c))
//           a += Number(c);
//      }
//          return a;
//      },0);
    Logger.log("sum: " + sum);
    SpreadsheetApp.getActiveSpreadsheet().getRange("Score!"+ cellName + ":" + cellName).setValue(sum);
    return sum;
}

function showDialog() {								
	var html = HtmlService.createTemplateFromFile('Page').evaluate();
	SpreadsheetApp.getUi().showSidebar(html);								
}

var Group = function(){								
	try{
    return SpreadsheetApp.getActiveSpreadsheet().getRange("CriteriaInfo!A2:A22").getValues();
    }catch(e){								
        return null								
    }								
}

var SubElements = function(){								
	try{								
    return SpreadsheetApp.getActiveSpreadsheet().getRange("CriteriaInfo!B2:B22").getValues();
    }catch(e){								
        return null								
    }								
}

function fillCell(e){								
	var s = [];
  var indexLearnerArray = [];						
  var startLearnerArray = [];
	for(var i in e){								
		if(i.substr(0, 2) == 'ch') s.push("\n"+e[i]);								
  }								
    if(s.length)
    {
        var learnerArray = s.toString().split(',');
        for(i = 0; i < learnerArray.length;i++)
        {
            indexLearnerArray[i] = learnerArray[i].indexOf(":",i);
            if (i == 0) 
              startLearnerArray[i] = learnerArray[i].length;
            else 
              startLearnerArray[i] = startLearnerArray[i-1] + 1 + learnerArray[i].length;
        }
        
        let value = SpreadsheetApp.newRichTextValue().setText(s.toString());

        for(i = 0; i < learnerArray.length;i++)
        {
          if(i == 0) 
          {  
             value.setTextStyle(0, indexLearnerArray[i],SpreadsheetApp.newTextStyle().setBold(true).build());
          }
          else
          {
            value.setTextStyle(startLearnerArray[i-1]+1, startLearnerArray[i-1]+indexLearnerArray[i]+2,SpreadsheetApp.newTextStyle().setBold(true).build());
          }

        }
        SpreadsheetApp.getActiveRange().setRichTextValue(value.build());
    } 
    var locationIndex = "Remarks!" + SpreadsheetApp.getActiveRange().getA1Notation();
    sumAmounts(locationIndex);
}