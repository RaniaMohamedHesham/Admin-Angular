import { style } from '@angular/animations';
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { Component,EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { IpcNetConnectOpts } from 'net';
import { CartService } from 'src/app/services/cart.service';
import { CategoryApiServiceService } from 'src/app/services/category-api-service.service';
import { ProductsAPIService } from 'src/app/services/products-api.service';
import { ProductsService } from 'src/app/services/products.service';
import { cart } from 'src/app/View Models/Cart';
import { ICategory } from 'src/app/View Models/icategory';
import { IProduct } from 'src/app/View Models/iproduct';
import { Store } from 'src/app/View Models/store';
//import { EventEmitter } from 'stream';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit,OnChanges {

  store:Store;
  //productlist:IProduct[];
  //category:ICategory[];
 ClientName:string="";
  isPurshased:boolean=true;
  divflag:boolean=false;
  SelectedID:number=0;
  //NewProductList:IProduct[];
  todayDate:Date=new Date();
  CreditCard:string="";
  nationalID:string="";
  ID:string="";
  @Input()receiverselectedCatID:number=0;
  orderTotalPrice:number=0;
  prodListOfCat:IProduct[]=[];
  catList:ICategory[]=[];
  product:IProduct|undefined;
  currentProduct:IProduct={}as IProduct;
  newproduct:IProduct={}as IProduct;
  ProUpdateid:number=0;






  @Output() additemtocard: EventEmitter<cart>;

  


  constructor( 
    //private prdService:ProductsService ,
    private activatedRoute:ActivatedRoute,
    private cartService : CartService,
    private prdApiService:ProductsAPIService,
    private catApiService:CategoryApiServiceService,
    private router:Router) {

    this.additemtocard= new EventEmitter<cart>();


    this.store={
      Name:"General Store",
      Logo:"https://ae01.alicdn.com/kf/Hbe41ad9bbeae439580c23e3a93a53402W.jpg_q50.jpg",
      Branches:["Alexandria","Cairo","Assiut","Minya","Aswan","Sohag"]

    }
    // this.category=[
    //   {
    //   ID:1,
    //   Name:"electronics"
    // },
    // {
    //   ID:2,
    //   Name:"Mobiles"
    // },
    // {
    //   ID:3,
    //   Name:"Televisions"
    // },
    // ];

    // this.productlist=[   
    // ];


    // this.NewProductList=[];

   }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.receiverselectedCatID);
    //this.prodListOfCat=this.prdService.getProductsByCateogryID(this.receiverselectedCatID);
     
    this.prdApiService.getProductsByCateogryID(this.receiverselectedCatID).subscribe(prdList=>{
      this.prodListOfCat=prdList;
    });   

   



    this.catApiService.getAllCategories().subscribe(cateList=>{
      this.catList=cateList;
    });

     

    

    // if(this.receiverselectedCatID==0)
    // {
    //   this.prodListOfCat=this.productlist;
    // }
    // else{

    
    // this.prodListOfCat= this.productlist.filter(prd=>prd.CategoryID==this.receiverselectedCatID);
    // }
  }



  ngOnInit(): void {
 

    this.ProUpdateid=Number(this.activatedRoute.snapshot.paramMap.get("pid"));
  if(this.ProUpdateid!=0)
  {
    this.prdApiService.getProductsByID(this.ProUpdateid).subscribe(prd=>{
      this.newproduct=prd;
    });
  }
  


//   this.curPrdID=Number(this.activatedRoute.snapshot.paramMap.get("pid"));
//   this.prdServiceApi.getProductsByID(this.curPrdID).subscribe(prd=>{
//     this.currprd=prd;
// });



    // this.prodListOfCat=this.prdService.getProductsByCateogryID(this.receiverselectedCatID);
                // this.prdApiService.getAllProducts().subscribe(prdList=>{
                //   this.prodListOfCat=prdList;
                // });

    


              // this.catApiService.getAllCategories().subscribe(cateList=>{
              //   this.catList=cateList;
              // });
  }



  // openProductDetails(prdID:number)
  // {
  //   this.router.navigate(['/Products',prdID]);
  // }


  addtocart(item: any){
    this.cartService.addtoCart(item);
  }


  OpenPopUp(productID:number):void
  {
   this.prdApiService.getProductsByID(productID).subscribe(ReceivedProduct=>{
      this.product=ReceivedProduct;
  })
}

  showproduct(id:string)
  {
   // this.NewProductList=this.productlist.filter(p=>p.CategoryID==parseInt(id))
  }




  // updataOrderTotalPrice(itemsCount:number,Price:number){
  //     this.orderTotalPrice+=(itemsCount*Price);
  //     //Emit Event
  //   this.onTotalPriceChanged.emit(this.orderTotalPrice);

     
  // }



  // updateProduct(id:number)
  //   {
  //     this.prdApiService.UpdateProduct(this.currentProduct,id).subscribe(prd=>{
  //       this.router.navigate(['/Order']);
  //     });
  //   }



  saveProduct()
  {
    
    this.ProUpdateid=Number(this.activatedRoute.snapshot.paramMap.get("pid"));
    if(this.ProUpdateid!=0)
    {
      this.prdApiService.UpdateProduct(this.newproduct,+this.ProUpdateid).subscribe(prd=>{
        this.router.navigate(['/Order']);
      });
    }
    else
    {
      this.prdApiService.AddnewProduct(this.newproduct).subscribe(prd=>{
        this.router.navigate(['/Order']);
      });
    }
    
  }
  
 
  



    DeleteProduct(id:number)
    {
      if(confirm("Are You Sure You Want To delete This Item?"))
      {
      this.prdApiService.DeleteProduct(id).subscribe(prd=>{
        this.router.navigate(['/Order'])
        .then(() => {
          window.location.reload();
          });

      });

    //   this.prdApiService.getAllProducts().subscribe(prd=>{
    //     this.router.navigate(['/Order'])
    //     .then(() => {
    //       window.location.reload();
    //       });
        
    // }
    // );
  
  }
    }



  AddItemToCard(product:IProduct,count:number){
    
    var newAdd:cart={
      
    
      "productName":product.name,
      "productID":product.id,
      "productPrice":product.price,
      "count":count,
      "total":product.price*count
    }
    
    this.additemtocard.emit(newAdd);
   
    
  }


/* FilteredList:IProduct[]=[];
chooseID(id:number)
{
  this.FilteredList=[];
  for(let item of this.productlist)
  {
    if(item. CategoryID==id)
    this.FilteredList.push(item);
  }
} */







  toggleTable()
  {
    this.isPurshased=!this.isPurshased;
    this.divflag=!this.divflag;
    
  }

}
