let {loadAllItems,loadPromotions} = require("./datbase");
module.exports = function main(inputs) {
    let result = [];
    let items = loadAllItems();

    //统计购买的东西
    for(let i = 0; i<inputs.length; i++){
        for(let j in items){
            if(items[j].barcode === inputs[i].substring(0,10)){
                if(!result[inputs[i]]){
                    if(items[j].barcode===inputs[i]) {
                        result[inputs[i]] = 1;
                    }else {
                        result[inputs[i].substring(0,10)] = parseInt(inputs[i].substring(11,12));
                    }
                }else{
                    result[inputs[i]]++;
                }
            }
        }
    }
    console.log(result);

//计算赠品
    let onSale = loadPromotions();
    let zengPin = [];
    for(let j in onSale){
        for(let i in onSale[j].barcodes){
            if(result[onSale[j].barcodes[i]] >= 2){
                zengPin[onSale[j].barcodes[i]] = 1;
            }
        }
    }

    console.log(zengPin);

    //输出
    let str = "***<没钱赚商店>购物清单***\n";
    let countSmall = 0;
    let countAll = 0;
    for(let j in items){
        if(result[items[j].barcode]){
            if(zengPin[items[j].barcode]){
                countSmall = items[j].price*(result[items[j].barcode]-zengPin[items[j].barcode]);
            }else{
                countSmall = items[j].price * result[items[j].barcode];
            }
            countAll += countSmall;
            str += '名称：'+items[j].name+'，数量：'+result[items[j].barcode]+items[j].unit+'，单价：'+
                items[j].price.toFixed(2)+"(元)，小计："+countSmall.toFixed(2)+"(元)\n"
        }
    }//需要注意的是，number.toFixed()是四舍五入的精确型
    //四瓶雪碧赠一瓶，五瓶计算的时候减去一瓶赠品


    let str1 = "挥泪赠送商品：\n";
    let countSave = 0;
    for(let k in items){
        if(zengPin[items[k].barcode]){
            str1 += "名称："+items[k].name+"，数量："+zengPin[items[k].barcode]+items[k].unit+"\n";
            countSmall = items[k].price*zengPin[items[k].barcode];
            countSave += countSmall;
        }
    }
    let str2 = "总计："+countAll.toFixed(2)+"(元)\n"+"节省："+countSave.toFixed(2)+"(元)\n" ;

    str += "----------------------\n" +str1 +"----------------------\n" +str2+"**********************";
    console.log(str);
};