<template>
  <div>
    <div class="button-wrap">
      <el-alert
          style="background-color: #f0f9eb; color: #67C23A;"
        title="在绘制模式时，双击图形可进行选中编辑；单击未选中图形区域或切换模式会取消选中"
        type="info"
        show-icon
      >
      </el-alert>



      <el-button
          type="primary"
          icon="el-icon-view"
          size="medium"
          style="margin-left: 10px"
        plain
        @click="exportImage('base64')"
        >base64图片</el-button
      >

              <el-button
                  type="primary"
                  v-show="protype==9"
                  size="medium"
                  plain
                  @click="setMode('CLEARMASK')">
<!--                CLEARMASK-->
                <img class="logo" src="../assets/eraser.svg" alt="" />涂抹擦除</el-button
              >


      <el-button type="primary" icon="el-icon-view" size="medium" style="margin-left: 10px" plain @click="exportImage('blob')"
        >blob图片</el-button
      >
      <el-button type="primary" icon="el-icon-download" size="medium" style="margin-left: 10px" plain @click="getFeatures()"
        >获取标注数据</el-button
      >

      <a href="javascript:;" class="file" style="margin-left: 10px; font-size: 14px; margin-top: 0;
        padding-top: 6px; padding-bottom: 6px; padding-left: 20px; padding-right: 20px;
        background-color: rgb(236,245,255); color: rgb(64, 158, 255); border-color: rgb(64,158,255); " v-show="false">
        <i class="el-icon-upload2"></i>
        标注数据回显
        <input id="input" type="file" plain @change="displayFeatures()" />
      </a>
      <el-button v-show="false" type="info" size="small" style="margin-left: 10px" plain @click="preserveThis"
        >保存标注数据</el-button
      >
      <el-button v-show="false" type="info" size="small" plain @click="reproduceThis"
        >显示存储数据</el-button
      >
      <el-button type="primary"  icon="el-icon-edit" plain @click="submitPicture_back" style="float: right; margin-top: 5px ;"
      >返回任务列表</el-button
      >

      <!-- <el-button type="primary" size="small" plain @click="produceImg"
        >导出图片</el-button
      > -->
    </div>
    <div class="box">

      <div class="bannerBox">
        <div class="gallery-thumbs">
          <div class="swiper-wrapper" style="height: 600px;overflow:auto">
            <div v-for="(item,index) of projectImgs" :key="index">
              <img class="img" :src="item" v-show="item!==''" @click="preserveThis(),submitPicture_check(index)" style="height: 90px; width: 90px; margin-top: 5px; margin-bottom: 5px; margin-right: 10px; object-fit: cover; object-position: 50% top">
            </div>
          </div>
        </div>
      </div>

      <div id="map"></div>
<!--      <button @click="foldToolbar" id="btn">-->
<!--        {{ foldSymbol }}-->
<!--      </button>-->
      <div class="own" v-show="showMsg">
        <div
            v-if="protype==6"
          v-for="(lay, index) in layers"
          v-show="lay.type!='DRAWMASK'&&lay.type!=null"
          :key="index"



        >
          <el-button
              style="margin-left: 15px"
              type="primary"
              size="medium"
              icon="el-icon-refresh-left"
              plain
              @click="deIcon1()"
          >撤销</el-button>
          <el-button

              type="primary"
              size="medium"
              style="margin: 2px"
              icon="el-icon-clear"
              plain
              @click="deIcon()"
          >清除</el-button>
          <el-button
              v-show="protype==6"
              type="primary"
              size="medium"
              style="margin: 2px"
              icon="el-icon-clear"
              plain
              @click="reset"
          >重置</el-button>

          <br>
          <el-button
              align="left"
              style="margin-left: 15px"
              type="primary"
              plain
              size="medium"
              @click="active(index)"
          >
            <img src="../assets/brush.svg" alt="" />

            </el-button>
          <el-button type="primary" size="medium" plain @click="setMode('PAN')">平移</el-button>
        </div>

        <div
            v-if="protype==9"
            v-for="(lay, index) in layers"
            v-show="lay.type=='DRAWMASK'"
            :key="index"



        >
          <!-- icon="el-icon-view" -->

          <el-button
              style="margin-left: 15px"
              type="primary"
              size="medium"
              icon="el-icon-refresh-left"
              plain
              @click="deIcon1()"
          >撤销</el-button>
          <el-button

              type="primary"
              size="medium"

              icon="el-icon-clear"
              plain
              @click="deIcon()"
          >清除</el-button>


          <br>
          <el-button
              align="left"
              style="margin-left: 15px"
              type="primary"
              plain
              size="medium"
              @click="active(index)"
          >
            <img src="../assets/brush.svg" alt="" />

          </el-button>
          <el-button type="primary" size="medium" plain @click="setMode('PAN')"
          ><img class="logo" src="../assets/hand-index-thumb.svg" alt="" />
            平移</el-button
          >

        </div>
        <el-button
            type="primary"
            style="margin-left: 15px"
            v-show="protype==9"
            size="medium"
            plain
            @click="setMode('CLEARMASK')">
          <!--                CLEARMASK-->
          <img class="logo" src="../assets/eraser.svg" alt="" />涂抹擦除</el-button
        >

        <div style="margin-left: 5% ;margin-top: 10px">
          <div v-show="protype==6||protype==9">
          <el-slider  v-if="protype==6" v-model="style.lineWidth" :max="10"  :step="0.5" :min="0.5" @change="setStyle1" show-input> </el-slider>
            <el-slider  v-else="protype==9" v-model="style.lineWidth" :max="50"  :step="5" :min="10" @change="setStyle1" show-input> </el-slider>
          <input style="width:120px" type="color" v-model="style.strokeStyle" @change="setStyle1" /><br />
          </div>
          <el-button
              v-show="protype==9"
              style="margin: 2px"
              size="small"
              type="info"
              @click="setStyle"
          >涂抹样式</el-button
          >

          <p>
            上次更新时间<br>
            {{update}}
          </p>
          <el-button
            style="margin: 2px"
            size="small"
            type="info"
            @click="submitPicture_l"
            >上一张</el-button
          >
          <el-button
            style="margin: 2px"
            size="small"
            type="info"
            @click="submitPicture_n"
            >下一张</el-button
          >
          <el-button
              v-show="false"
            style="margin: 2px"
            size="small"
            type="info"
            @click="submitPicture"
            >提交该图片</el-button
          >
        </div>
        <div style="float: left; clear: both; margin-top: -10px" v-for="(attrison, indexon) in attris" :key="'1'+indexon">
          <p
              v-if="protype==3"
              v-show="indexon > 0"
              style="
              font-size: medium;
              color: #606266;
              width: 85px;
              height: 20px;
              overflow: hidden;
              margin-top: 10px;
            "
          >
            {{ attrison.name }}
          </p>
<!--          <template v-if="protype==4||protype==5">-->
<!--&lt;!&ndash;            <el-radio-group v-model="form[attrison.opts]">&ndash;&gt;-->
<!--              <el-radio-group v-model="radio">-->
<!--              <el-radio v-for="(item, index) in attrison.opts" :key="'2'+index" :label="index" @change="showAttri(item,index)">{{item}}</el-radio>-->
<!--            </el-radio-group>-->
<!--          </template>-->
          <template v-if="protype==3">
            <!--            <el-radio-group v-model="form[attrison.opts]">-->
            <el-radio-group v-model="form[attrison.name]">
              <el-radio v-for="(item, index) in attrison.opts" :key="index" :label="index" @change="showAttri(item,index,attrison.name)">{{item}}</el-radio>
            </el-radio-group>
          </template>
        </div>
        <div style="margin-top: 10px" v-if="protype==5||protype==4">
          <table>
            <tr>
              <th colspan="10" style="text-align: center;
        font-size: 20px;
        color: #00a7d0;"
              >网络模型预测结果</th>
            </tr>
            <tr>
              <th>患病类型</th>
              <th>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</th>
              <th>患病概率</th>
            </tr>
            <tr   v-for="(index,item,i) in tableNet">



              <td><el-radio :key="'index'+i" v-model="radio" :label=i @change="showAttri(item,index)">{{item}}</el-radio></td>
            <td></td>
              <td>
                <el-progress   type="circle" :percentage="index.split('%')[0]-0" :width=60 :key="i+'index1'"></el-progress>
              </td>
            </tr>
        </table>
        </div>
<!--        <div style="margin-top: 200px" v-else-if="protype==4">-->
<!--          <table>-->
<!--            <tr>-->
<!--              <th colspan="10" style="text-align: center;-->
<!--        font-size: 20px;-->
<!--        color: #00a7d0;"-->
<!--              >网络模型预测结果</th>-->
<!--            </tr>-->
<!--            <tr>-->
<!--              <th>患病类型</th>-->
<!--              <th>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</th>-->
<!--              <th>患病概率</th>-->
<!--            </tr>-->
<!--            <tr  v-for="(index,item,i) in tableNet">-->
<!--              <td>{{item}}</td>-->
<!--              <td></td>-->
<!--              <el-progress v-if="i==radio" type="circle" :percentage="index.split('%')[0]" width="60" color="red"></el-progress>-->
<!--              <el-progress  v-else type="circle" :percentage="index.split('%')[0]" width="60" ></el-progress>-->
<!--            </tr>-->
<!--          </table>-->
<!--        </div>-->

      </div>

    </div>
    <el-dialog
        style=""
        title="选择样式"
        :visible.sync="dialogVisible"
        width="30%"
    >
      <p>线&emsp;&emsp;宽&emsp;:&emsp;&emsp;<input style="width:110px" v-model="style.lineWidth" /><br /></p>
      <p>涂抹/边框&ensp;:&emsp;&emsp;<input style="width:120px" type="color" v-model="style.strokeStyle" /><br /></p>
      <p v-show="fillstyleVisible"> 填&ensp;充&ensp;色&emsp;:&emsp;&emsp;<input
          style="width:120px"
          type="color"
          v-model="style.fillStyle"
      /><br /></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setStyle1">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-model="formAttris"
      title="设置属性"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <div
          v-for="(item, formi) in formAttris"
          :key="formi + 'b'"
          @click="activeForm(item)"
        >
          <el-form-item
            v-show="item != '__ob__'"
            :label="item"
            label-width="140px"
          >
            <el-input
              readonly="readonly"
              v-model="form[item]"
              autocomplete="off"
              >form[item]</el-input
            >
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button @click="dialogFormVisible = false">关 闭</el-button>

      </div>
    </el-dialog>
    <!-- 保存属性集 -->
    <el-dialog title="保存当前属性集" :visible.sync="dialogSaveFormVisible">
      <el-form :model="attriss">

        <el-form-item label="保存属性集名称" label-width="140px">
          <!-- <el-input v-model="attriss[attriss.length].name" autocomplete="off"></el-input> -->
          <el-input v-model="attrissName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSaveFormVisible = false">关 闭</el-button>
        <el-button type="primary" @click="SaveAttri">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择属性集 -->
    <el-dialog title="选择已有属性集" :visible.sync="dialogSelFormVisible">
      <el-form :model="everyAttrissName">
        <div
          v-for="(item, index) in everyAttrissName"
          :key="index"
          @click="activeAttriss(item)"
        >
          <el-form-item label="已有属性集名称" label-width="140px">
            <el-input
              readonly="readonly"
              v-model="everyAttrissName[index]"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelFormVisible = false">关 闭</el-button>
        <el-button type="primary" @click="SelAttri1">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 确定更换属性集对话框 -->
    <el-dialog title="更换属性集" :visible.sync="dialogChangeFormVisible">
      将目前属性集更换为
      <input
        style="border: 0px; background-color: transparent"
        readonly="readonly"
        v-model="activeAttrissName"
        autocomplete="off"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="SelAttri">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除属性对话框 -->
    <el-dialog title="删除属性" :visible.sync="dialogDelFormVisible">
      <input
        style="border: 0px; background-color: transparent"
        readonly="readonly"
        v-model="formid"
        autocomplete="off"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="delAttri">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加属性对话框 -->
    <el-dialog title="添加属性" :visible.sync="dialogAttriVisible">
      <el-form :model="attri">
        <el-form-item label="属性名称" label-width="140px">
          <el-input v-model="attri.name" autocomplete="off"></el-input>
        </el-form-item>
        <div v-for="(ar, ord) in arrys" :key="ord" @click="activeAttri(ord)">
          <el-form-item label="属性值" label-width="140px">
            <!-- <el-input v-model="attri.opts[ord]" autocomplete="off">{{a}}</el-input> -->
            <el-input v-model="attri.opts[ord]" autocomplete="off"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAttri2">新增属性值</el-button>
        <el-button @click="delAttri2">删除该值</el-button>
        <el-button @click="dialogAttriVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttri1">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除属性值对话框 -->
    <el-dialog title="删除属性值" :visible.sync="dialogDelFormOptVisible">
      <input
        style="border: 0px; background-color: transparent"
        readonly="readonly"
        v-model="attri.opts[order]"
        autocomplete="off"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelFormOptVisible = false">取 消</el-button>
        <el-button type="primary" @click="delAttri1">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import AILabel from "ailabel";
//import html2canvas from "html2canvas";
import domtoimage from "dom-to-image";
import Recorder from "js-audio-recorder";

export default {
  data() {
    return {
      width:500,
      heigth:364,
      update:'',
      radio:1,
      radios:[],
      net:"",
      tableNet:[],
      fillstyleVisible: false,
      proid:this.$route.params.id,
      protype:this.$route.params.type,
      recognition: null,
      recording: false,
      id: 0,
      order: 0, //记录当前选中的属性值
      formid: "", //记录当前选中的属性
      gMap: "",
      isButton: true,
      isFold: true,
      // divWidth: "width:230px",
      foldSymbol: ">>",
      layers: [
        {
          id: "first-layer-mask",
          allFeatures: [],
          exit: true,
          svgcode:
              "M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z",
          imgArr:
              "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F29381f30e924b899e7b98bc669061d950b7bf643.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638415117&t=10ad7679c9c07316fa9ecb143a1e813e",
          name: "涂抹层",
          style: {
            lineWidth: 1,
            strokeStyle: "#FF0000",
          },
          type: "DRAWMASK",
        },

      ],
      attrissName: "",
      activeLayer: 0,
      drawingStyle: {}, // 绘制过程中样式
      dialogVisible: false,
      dialogFormVisible: false,
      gFirstFeatureLayer: null,
      dialogAttriVisible: false,
      dialogDelFormVisible: false, //删除属性提示框
      dialogDelFormOptVisible: false, //删除属性值提示框
      dialogSaveFormVisible: false, //保存当前属性集提示框
      dialogSelFormVisible: false, //选择属性集提示框
      dialogChangeFormVisible: false, //更换属性集提示框
      dialogRecordVisible: false,
      deleteIconId: "delete01",
      activeAttrissName: "", //当前选中的属性集的名称
      index: 0,
      showMsg:true,
      attriss: [], //创建的属性集的集合
      everyAttrissName: [], //属性集的名称
      attris: [
        {
          name: "",
          opts: [],
          // opt2:"",
          // opt3:"",
        },
      ], //添加属性的属性名和属性选项的集合
      attrii: {
        name: "",
        opts: [],
      }, //更新
      attri: {
        name: "",
        opts: [],
      }, //每次新增一个属性，该属性存放的位置
      style: {
        lineWidth: 1,
        strokeStyle: "#FF0000",
        fillStyle: "#FF0000",

      },
      form: {}, //图片现有的属性以及属性值
      formAttris: [], //form,即现有属性的属性名的集合
      arrysi: [0, 1], //更新
      arrys: [0, 1], //记录添加的属性有多少属性值
      types: [
        {
          label: "平移",
          logoImg:
            "M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025zg",
          value: "PAN",
        },
      ],
      type: "",
      imgUrl: [
        { id: 1, url: "https://source.unsplash.com/uYyLWm7V-9U" },
        { id: 2, url: "https://source.unsplash.com/LD4KsgYUjxI" },
        { id: 3, url: "https://source.unsplash.com/MQFNx9pVPRQ" },
        { id: 4, url: "https://source.unsplash.com/7gM1R2yLfXk" },
        { id: 5, url: "https://source.unsplash.com/jso_yKod6-c" },
        { id: 6, url: "https://source.unsplash.com/46vZtdZhWAs" },
        {
          id: 7,
          url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.china-radiology.com%2Fdata%2Fattachment%2Fforum%2F201905%2F05%2F183106z6tmw11xz6f9tndi.jpg&refer=http%3A%2F%2Fwww.china-radiology.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1637231068&t=6ed268a030677e145cd16570f2a368f1",
        },
      ],
      activeImage: "",
      projectImgs: [],
      name:"",
      recorder: new Recorder({
        sampleBits: 16, // 采样位数，范围8或16
        sampleRate: 16000, // 采样率，范围11025、16000、22050、24000、44100、48000
        numChannels: 1, // 声道，范围1或2
      }),
    };
  },
  methods: {
    setMode(mode) {
      this.gMap.setMode(mode);
      switch (this.gMap.mode) {
        case "PAN": {
          break;
        }
        case "MARKER": {
          // 忽略
          break;
        }
        case "POINT": {
          // this.drawingStyle = { fillStyle: "#9370DB" };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "CIRCLE": {
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "LINE": {
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "POLYLINE": {
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "RECT": {

          this.layers[this.activeLayer - 1].style=this.style
          console.log(this.layers[this.activeLayer - 1].style)
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "POLYGON": {
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "DRAWMASK": {
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        //CLEARMASK
        case "CLEARMASK": {

          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        default:
          break;
      }
    },
    showAttri(item,index,attrison){
      console.log(this.form)
       console.log(this.form[attrison])//当前属性值对应的值
      console.log(item)


    },
    deIcon() {
      if(this.protype==9)
      this.gMap.getLayers()[1].removeAllActions()
      else {
        // console.log(this.gMap)
        this.gMap.getLayers()[3].removeAllFeatures();
      }
    },
    reset(){
      this.style.lineWidth=1
      this.style.strokeStyle="#FF0000"
      this.gMap.getLayers()[3].removeAllFeatures();
        let data = this.activeImage;
        this.$axios({
          //请求类型
          method: "POST",
          //URL
          url: "/api/returnNet/",
          //设置请求体
          data: data.replace(/\+/g,"%2B"),
        }).then((response) => {
          //console.log(response.data);
          const result = response.data['txt'];
          const update = response.data['update']
          const allLayers = result.split("\n****************\n");
          //console.log(allLayers);
          this.update=update
          for (let j = 0; j < allLayers.length - 1; j++) {
            let name = allLayers[j].split("\n")[1];
            let exit = false;
            let number = 0;
            for (let k = 0; k < this.layers.length; k++) {
              if (this.layers[k].name == name) {
                exit = !exit;
                number = k;
              }
            }
            if (exit) {
              let lay = this.gMap.getLayers()[number + 2];
              const allMark = allLayers[j].split("\n----------\n");
              // console.log(allMark);
              for (let i = 0; i < allMark.length - 1; i++) {
                const allAttribute = allMark[i].split("\n");
                let id, type, shape, props, style;
                if (i == 0) {
                  id = allAttribute[3];
                  type = allAttribute[5];
                  shape = JSON.parse(allAttribute[7]);
                  props = JSON.parse(allAttribute[9]);
                  style = JSON.parse(allAttribute[11]);
                } else {
                  id = allAttribute[1];
                  type = allAttribute[3];
                  shape = JSON.parse(allAttribute[5]);
                  props = JSON.parse(allAttribute[7]);
                  style = JSON.parse(allAttribute[9]);
                }
                //console.log(id, type, shape, props, style);
                switch (type) {
                  case "POINT":
                    let gFirstFeaturePoint = new AILabel.Feature.Point(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeaturePoint);
                    this.layers[number].allFeatures.push(gFirstFeaturePoint);
                    break;
                  case "LINE":
                    let gFirstFeatureLine = new AILabel.Feature.Line(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeatureLine);
                    this.layers[number].allFeatures.push(gFirstFeatureLine);
                    break;
                  case "POLYLINE":
                    let polylineFeature = new AILabel.Feature.Polyline(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(polylineFeature);
                    this.layers[number].allFeatures.push(polylineFeature);
                    break;
                  case "RECT":
                    let gFirstFeatureRect = new AILabel.Feature.Rect(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeatureRect);
                    this.layers[number].allFeatures.push(gFirstFeatureRect);
                    break;
                  case "POLYGON":
                    let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeaturePolygon);
                    this.layers[number].allFeatures.push(gFirstFeaturePolygon);
                    break;
                  case "CIRCLE":
                    let gFirstFeatureCircle = new AILabel.Feature.Circle(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeatureCircle);
                    this.layers[number].allFeatures.push(gFirstFeatureCircle);
                    break;
                  case "DRAW":
                    let gFirstMask = new AILabel.Layer.Mask(
                        id, // id
                        //shape, // shape
                        props, // props
                        style // style
                    );

                    const drawMaskAction = new AILabel.Mask.Draw(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    this.gMap.getLayers()[1].addAction(drawMaskAction);

                    this.layers[0].allFeatures.push(drawMaskAction);
                    break;

                  default:
                    console.log("nonono");
                }
              }
            } else {
              if (this.protype == 6) {
                const id = this.layers.length + "";


                const lay = new AILabel.Layer.Feature(
                    id, // id
                    {name: "矢量图层"}, // props
                    {zIndex: 20} // style
                );
                this.gMap.addLayer(lay);


                this.layers.push({
                  id: id,
                  allFeatures: [],
                  exit: true,
                  name: name,
                });
                const allMark = allLayers[j].split("\n----------\n");
                //console.log(allMark);

                for (let i = 0; i < allMark.length - 1; i++) {
                  const allAttribute = allMark[i].split("\n");
                  console.log(allAttribute)
                  let id, type, shape, props, style;
                  if (i == 0) {
                    id = allAttribute[3];
                    type = allAttribute[5];
                    shape = JSON.parse(allAttribute[7]);
                    props = JSON.parse(allAttribute[9]);
                    style = JSON.parse(allAttribute[11]);
                  } else {
                    id = allAttribute[1];
                    type = allAttribute[3];
                    shape = JSON.parse(allAttribute[5]);
                    props = JSON.parse(allAttribute[7]);
                    style = JSON.parse(allAttribute[9]);
                  }
                  //console.log(id, type, shape, props, style);
                  switch (type) {
                    case "POINT":
                      let gFirstFeaturePoint = new AILabel.Feature.Point(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeaturePoint);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeaturePoint
                      );
                      break;
                    case "LINE":
                      let gFirstFeatureLine = new AILabel.Feature.Line(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureLine);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureLine
                      );
                      break;
                    case "POLYLINE":
                      let polylineFeature = new AILabel.Feature.Polyline(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(polylineFeature);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          polylineFeature
                      );
                      break;
                    case "RECT":
                      let gFirstFeatureRect = new AILabel.Feature.Rect(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureRect);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureRect
                      );
                      break;
                    case "POLYGON":
                      let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeaturePolygon);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeaturePolygon
                      );
                      break;
                    case "CIRCLE":
                      let gFirstFeatureCircle = new AILabel.Feature.Circle(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureCircle);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureCircle
                      );
                      break;
                    case "DRAW":
                      let gFirstMask = new AILabel.Layer.Mask(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addLayer(gFirstMask);
                      this.layers[number].allFeatures.push(gFirstMask);
                      break;
                    default:
                      console.log("nonono");
                  }
                }
              }
              else {
                const id = this.layers.length + "";
                const lay = new AILabel.Layer.Mask(
                    id, // id
                    {name: "矢量图层"}, // props
                    {zIndex: 20, opacity: .5} // style
                );
                this.gMap.addLayer(lay);


                this.layers.push({
                  id: id,
                  allFeatures: [],
                  exit: true,
                  name: name,
                });
                const allMark = allLayers[j].split("\n----------\n");
                //console.log(allMark);

                for (let i = 0; i < allMark.length - 1; i++) {
                  const allAttribute = allMark[i].split("\n");
                  console.log(allAttribute)
                  let id, type, shape, props, style;
                  if (i == -1) {
                    id = allAttribute[3];
                    type = allAttribute[5];
                    shape = JSON.parse(allAttribute[7]);
                    props = JSON.parse(allAttribute[9]);
                    style = JSON.parse(allAttribute[11]);
                  } else {
                    id = allAttribute[1];
                    type = allAttribute[3];
                    shape = JSON.parse(allAttribute[5]);
                    props = JSON.parse(allAttribute[7]);
                    style = JSON.parse(allAttribute[9]);
                  }
                  console.log(id, type, shape, props, style);
                  switch (type) {
                    case "POINT":
                      let gFirstFeaturePoint = new AILabel.Feature.Point(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeaturePoint);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeaturePoint
                      );
                      break;
                    case "LINE":
                      let gFirstFeatureLine = new AILabel.Feature.Line(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureLine);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureLine
                      );
                      break;
                    case "POLYLINE":
                      let polylineFeature = new AILabel.Feature.Polyline(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(polylineFeature);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          polylineFeature
                      );
                      break;
                    case "RECT":
                      let gFirstFeatureRect = new AILabel.Feature.Rect(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureRect);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureRect
                      );
                      break;
                    case "POLYGON":
                      let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeaturePolygon);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeaturePolygon
                      );
                      break;
                    case "CIRCLE":
                      let gFirstFeatureCircle = new AILabel.Feature.Circle(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureCircle);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureCircle
                      );
                      break;
                    case "DRAW":
                      let gFirstMask = new AILabel.Layer.Mask(
                          id, // id
                          //shape, // shape
                          props, // props
                          style // style
                      );

                      const drawMaskAction = new AILabel.Mask.Draw(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );

                      this.gMap.getLayers()[1].addAction(drawMaskAction);

                      this.layers[0].allFeatures.push(drawMaskAction);
                      break;
                    default:
                      console.log("nonono");
                  }
                }
              }
            }
          }
        });

    },
    deIcon1() {
      if(this.protype==9) {
        const drawAction = this.gMap.getLayers()[1].getAllActions()
        this.gMap.getLayers()[1].removeActionById(drawAction[drawAction.length - 1].id);
      }
      else{
        //console.log(this.gMap)
        const allFeatures = this.gMap.getLayers()[3].getAllFeatures()
        this.gMap.getLayers()[3].removeFeatureById(allFeatures[allFeatures.length - 1].id);
      }
      },
    Revoke() {
      this.getFeatures1();
      if (this.allFeatures.length) {
        this.gFirstFeatureLayer.removeFeatureById(this.allFeatures[this.allFeatures.length - 1].props.id);

        this.allFeatures.pop();
        this.gMap.refresh(); // 刷新map
      }
    },
    getFeatures1() {
      let allFeatures = "";
      for (let j = 0; j < this.layers.length; j++) {
        allFeatures += "lay:\n";
        allFeatures += this.layers[j].name;
        allFeatures += "\n";
        let gFirstFeatureLayer = this.gMap.getLayers()[j + 2];
        let all = gFirstFeatureLayer.getAllFeatures();
        for (let i = 0; i < all.length; i++) {
          allFeatures += "id:\n";
          allFeatures += all[i].id;
          allFeatures += "\n";
          allFeatures += "type:\n";
          allFeatures += all[i].type;
          allFeatures += "\n";
          allFeatures += "shape:\n";
          allFeatures += JSON.stringify(all[i].shape);
          allFeatures += "\n";
          allFeatures += "props:\n";
          allFeatures += JSON.stringify(all[i].props);
          allFeatures += "\n";
          allFeatures += "style:\n";
          allFeatures += JSON.stringify(all[i].style);
          allFeatures += "\n----------\n";
        }
        allFeatures += "\n****************\n";
      }
    },


    // 增加删除图标
    addDeleteIcon(feature, shape) {
      let gMap = this.gMap;
      let that = this;
      // 添加delete-icon
      // let points = that.getPoints(feature);
      console.log(shape, "shape");
      let x = (shape?.x || shape?.cx || shape?.start?.x || shape?.points[0].x) + (shape?.width || shape?.r || 0)
      let y = (shape?.y || shape?.cy || shape?.start?.y || shape?.points[0].y) - 15
      const gFirstMarker = new AILabel.Marker(
          that.deleteIconId, // id
          {
            src: require("../assets/imgs/删除.png"),
            position: { x, y }, // 矩形右上角 根据图形动态调整
            offset: {
              x: -20,
              y: -4,
            },
          }, // markerInfo
          { name: "delete" } // props
      );
      gFirstMarker.events.on("click", (marker) => {
        // 首先删除当前marker
        gMap.markerLayer.removeMarkerById(marker.id);
        // 删除对应text
        // gFirstTextLayer.removeTextById(textId);
        // 删除对应feature
        that.gMap.getLayers()[that.activeLayer+1].removeFeatureById(feature.id)
        that.layers[that.activeLayer-1].allFeatures = that.gMap.getLayers()[that.activeLayer+1].features
      });
      gMap.markerLayer.addMarker(gFirstMarker);

    },
    //折叠图片，改变toolbar的width
    foldToolbar() {
      if (this.foldSymbol == ">>") {
        this.foldSymbol = "<<";
        this.isFold = !this.isFold;
      } else {
        this.foldSymbol = ">>";
        this.isFold = !this.isFold;
      }
    },
    // 导出图片
    async exportImage(type) {
      const imagedata = await this.gMap.exportLayersToImage(
        { x: 0, y: 0, width: 500, height: 354 },
        { type, format: "image/png" }
      );

      const imageDom = new Image();
      if (type === "base64") {
        // 导出base64格式
        imageDom.src = imagedata;
      } else {
        // 导出blob格式
        const url = URL.createObjectURL(imagedata);
        imageDom.src = url;
        imageDom.onload = () => {
          URL.revokeObjectURL(url);
        };
      }

      let aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = imageDom.src;
      aLink.download = "export.png";
      // 触发点击-然后移除
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
    },
    // 获取标注数据
    getFeatures() {
      let allFeatures = "";
      for (let j = 0; j < this.layers.length; j++) {
        allFeatures += "lay:\n";
        allFeatures += this.layers[j].name;
        allFeatures += "\n";
        let gFirstFeatureLayer = this.gMap.getLayers()[j + 2];
        let all = gFirstFeatureLayer.getAllFeatures();
        for (let i = 0; i < all.length; i++) {
          allFeatures += "id:\n";
          allFeatures += all[i].id;
          allFeatures += "\n";
          allFeatures += "type:\n";
          allFeatures += all[i].type;
          allFeatures += "\n";
          allFeatures += "shape:\n";
          allFeatures += JSON.stringify(all[i].shape);
          allFeatures += "\n";
          allFeatures += "props:\n";
          allFeatures += JSON.stringify(all[i].props);
          allFeatures += "\n";
          allFeatures += "style:\n";
          allFeatures += JSON.stringify(all[i].style);
          allFeatures += "\n----------\n";
        }
        allFeatures += "\n****************\n";
      }
      //console.log(allFeatures);
      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(allFeatures)
      );
      element.setAttribute("download", "features.txt");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    // 标注数据回显
    displayFeatures() {
      // const gFirstFeatureLayer = this.gMap.getLayers()[1];
      const input = document.querySelector("input[type=file]");
      const reader = new FileReader();
      reader.readAsText(input.files[0], "utf8"); // input.files[0]为第一个文件
      reader.onload = () => {
        const result = reader.result;
        //console.log(result); // reader.result为获取结果
        const allLayers = result.split("\n****************\n");
     //   console.log(allLayers);
        for (let j = 0; j < allLayers.length - 1; j++) {
          let name = allLayers[j].split("\n")[1];
          let exit = false;
          let number = 0;
          for (let k = 0; k < this.layers.length; k++) {
            if (this.layers[k].name == name) {
              exit = !exit;
              number = k;
            }
          }
          if (exit) {
            let lay = this.gMap.getLayers()[number + 2];
            const allMark = allLayers[j].split("\n----------\n");
            //.log(allMark);
            for (let i = 0; i < allMark.length - 1; i++) {
              const allAttribute = allMark[i].split("\n");
              let id, type, shape, props, style;
              if (i == 0) {
                id = allAttribute[3];
                type = allAttribute[5];
                shape = JSON.parse(allAttribute[7]);
                props = JSON.parse(allAttribute[9]);
                style = JSON.parse(allAttribute[11]);
              } else {
                id = allAttribute[1];
                type = allAttribute[3];
                shape = JSON.parse(allAttribute[5]);
                props = JSON.parse(allAttribute[7]);
                style = JSON.parse(allAttribute[9]);
              }
              //console.log(id, type, shape, props, style);
              switch (type) {
                case "POINT":
                  let gFirstFeaturePoint = new AILabel.Feature.Point(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePoint);
                  this.layers[number].allFeatures.push(gFirstFeaturePoint);
                  break;
                case "LINE":
                  let gFirstFeatureLine = new AILabel.Feature.Line(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureLine);
                  this.layers[number].allFeatures.push(gFirstFeatureLine);
                  break;
                case "POLYLINE":
                  let polylineFeature = new AILabel.Feature.Polyline(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(polylineFeature);
                  this.layers[number].allFeatures.push(polylineFeature);
                  break;
                case "RECT":
                  let gFirstFeatureRect = new AILabel.Feature.Rect(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureRect);
                  this.layers[number].allFeatures.push(gFirstFeatureRect);
                  break;
                case "POLYGON":
                  let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePolygon);
                  this.layers[number].allFeatures.push(gFirstFeaturePolygon);
                  break;
                case "CIRCLE":
                  let gFirstFeatureCircle = new AILabel.Feature.Circle(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureCircle);
                  this.layers[number].allFeatures.push(gFirstFeatureCircle);
                  break;
                default:
                  console.log("nonono");
              }
            }
          } else {
            const id = this.layers.length + "";
            const lay = new AILabel.Layer.Feature(
              id, // id
              { name: "矢量图层" }, // props
              { zIndex: 20 } // style
            );
            this.gMap.addLayer(lay);
            this.layers.push({
              id: id,
              allFeatures: [],
              exit: true,
              name: name,
            });
            const allMark = allLayers[j].split("\n----------\n");
            //console.log(allMark);
            for (let i = 0; i < allMark.length - 1; i++) {
              const allAttribute = allMark[i].split("\n");
              let id, type, shape, props, style;
              if (i == 0) {
                id = allAttribute[3];
                type = allAttribute[5];
                shape = JSON.parse(allAttribute[7]);
                props = JSON.parse(allAttribute[9]);
                style = JSON.parse(allAttribute[11]);
              } else {
                id = allAttribute[1];
                type = allAttribute[3];
                shape = JSON.parse(allAttribute[5]);
                props = JSON.parse(allAttribute[7]);
                style = JSON.parse(allAttribute[9]);
              }
              //console.log(id, type, shape, props, style);
              switch (type) {
                case "POINT":
                  let gFirstFeaturePoint = new AILabel.Feature.Point(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePoint);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeaturePoint
                  );
                  break;
                case "LINE":
                  let gFirstFeatureLine = new AILabel.Feature.Line(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureLine);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeatureLine
                  );
                  break;
                case "POLYLINE":
                  let polylineFeature = new AILabel.Feature.Polyline(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(polylineFeature);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    polylineFeature
                  );
                  break;
                case "RECT":
                  let gFirstFeatureRect = new AILabel.Feature.Rect(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureRect);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeatureRect
                  );
                  break;
                case "POLYGON":
                  let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePolygon);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeaturePolygon
                  );
                  break;
                case "CIRCLE":
                  let gFirstFeatureCircle = new AILabel.Feature.Circle(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureCircle);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeatureCircle
                  );
                  break;
                default:
                  console.log("nonono");
              }
            }
          }
        }
      };
    },
    hide(index) {
      const gFirstFeatureLayer = this.gMap.getLayers()[index + 2];
      gFirstFeatureLayer.removeAllFeatures();
    },
    backMe(index) {
      const gFirstFeatureLayer = this.gMap.getLayers()[index + 2];

      for (let i = 0; i < this.layers[index].allFeatures.length; i++) {
        gFirstFeatureLayer.addFeature(this.layers[index].allFeatures[i]);
      }
      // gFirstFeatureLayer.addFeature(this.layers[0].allFeatures[0]);
    },
    look(index) {
      if (this.layers[index].exit) {
        this.hide(index);
      } else {
        this.backMe(index);
      }
      this.layers[index].exit = !this.layers[index].exit;
    },
    active(index) {

      this.activeLayer = index + 1;
      this.drawingStyle = this.layers[index].style;
      this.setMode(this.layers[index].type);
      this.setStyle1()
    },
    addLayer() {
      const id = this.layers.length + "";
      const FeatureLayer = new AILabel.Layer.Feature(
        id, // id
        { name: "矢量图层" }, // props
        { zIndex: 20 } // style
      );
      this.gMap.addLayer(FeatureLayer);
      this.layers.push({
        id: id,
        allFeatures: [],
        exit: true,
        name: id + "",
        style: {},
      });
    },
    setStyle1() {
      this.preserveThis()
      if(this.protype==6) {
        this.gMap.getLayers()[3].removeAllFeatures();
        let data = this.activeImage;
        this.$axios({
          //请求类型
          method: "POST",
          //URL
          url: "/api/returnData1/",
          //设置请求体
          data: data.replace(/\+/g,"%2B"),
        }).then((response) => {
          //console.log(response.data);
          const result = response.data['txt'];
          const update = response.data['update']
          const allLayers = result.split("\n****************\n");
          //console.log(allLayers);
          this.update=update
          for (let j = 0; j < allLayers.length - 1; j++) {
            let name = allLayers[j].split("\n")[1];
            let exit = false;
            let number = 0;
            for (let k = 0; k < this.layers.length; k++) {
              if (this.layers[k].name == name) {
                exit = !exit;
                number = k;
              }
            }
            if (exit) {
              let lay = this.gMap.getLayers()[number + 2];
              const allMark = allLayers[j].split("\n----------\n");
              // console.log(allMark);
              for (let i = 0; i < allMark.length - 1; i++) {
                const allAttribute = allMark[i].split("\n");
                let id, type, shape, props, style;
                if (i == 0) {
                  id = allAttribute[3];
                  type = allAttribute[5];
                  shape = JSON.parse(allAttribute[7]);
                  props = JSON.parse(allAttribute[9]);
                  style = this.style
                } else {
                  id = allAttribute[1];
                  type = allAttribute[3];
                  shape = JSON.parse(allAttribute[5]);
                  props = JSON.parse(allAttribute[7]);
                  style = this.style
                }
                //console.log(id, type, shape, props, style);
                switch (type) {

                  case "RECT":
                    let gFirstFeatureRect = new AILabel.Feature.Rect(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeatureRect);
                    this.layers[number].allFeatures.push(gFirstFeatureRect);
                    break;

                  case "DRAW":
                    let gFirstMask = new AILabel.Layer.Mask(
                        id, // id
                        //shape, // shape
                        props, // props
                        style // style
                    );

                    const drawMaskAction = new AILabel.Mask.Draw(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    this.gMap.getLayers()[1].addAction(drawMaskAction);

                    this.layers[0].allFeatures.push(drawMaskAction);
                    break;

                  default:
                    console.log("nonono");
                }
              }
            } else {
              if (this.protype == 6) {
                const id = this.layers.length + "";


                const lay = new AILabel.Layer.Feature(
                    id, // id
                    {name: "矢量图层"}, // props
                    {zIndex: 20} // style
                );
                this.gMap.addLayer(lay);


                this.layers.push({
                  id: id,
                  allFeatures: [],
                  exit: true,
                  name: name,
                });
                const allMark = allLayers[j].split("\n----------\n");
                //console.log(allMark);

                for (let i = 0; i < allMark.length - 1; i++) {
                  const allAttribute = allMark[i].split("\n");
                  console.log(allAttribute)
                  let id, type, shape, props, style;
                  if (i == 0) {
                    id = allAttribute[3];
                    type = allAttribute[5];
                    shape = JSON.parse(allAttribute[7]);
                    props = JSON.parse(allAttribute[9]);
                    style = this.style
                  } else {
                    id = allAttribute[1];
                    type = allAttribute[3];
                    shape = JSON.parse(allAttribute[5]);
                    props = JSON.parse(allAttribute[7]);
                    style = this.style
                  }
                  //console.log(id, type, shape, props, style);
                  switch (type) {

                    case "RECT":
                      let gFirstFeatureRect = new AILabel.Feature.Rect(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureRect);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureRect
                      );
                      break;

                    case "DRAW":
                      let gFirstMask = new AILabel.Layer.Mask(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addLayer(gFirstMask);
                      this.layers[number].allFeatures.push(gFirstMask);
                      break;
                    default:
                      console.log("nonono");
                  }
                }
              }
              else {
                const id = this.layers.length + "";
                const lay = new AILabel.Layer.Mask(
                    id, // id
                    {name: "矢量图层"}, // props
                    {zIndex: 20, opacity: .5} // style
                );
                this.gMap.addLayer(lay);


                this.layers.push({
                  id: id,
                  allFeatures: [],
                  exit: true,
                  name: name,
                });
                const allMark = allLayers[j].split("\n----------\n");
                //console.log(allMark);

                for (let i = 0; i < allMark.length - 1; i++) {
                  const allAttribute = allMark[i].split("\n");
                  console.log(allAttribute)
                  let id, type, shape, props, style;
                  if (i == -1) {
                    id = allAttribute[3];
                    type = allAttribute[5];
                    shape = JSON.parse(allAttribute[7]);
                    props = JSON.parse(allAttribute[9]);
                    style = this.style
                  } else {
                    id = allAttribute[1];
                    type = allAttribute[3];
                    shape = JSON.parse(allAttribute[5]);
                    props = JSON.parse(allAttribute[7]);
                    style = this.style
                  }
                  console.log(id, type, shape, props, style);
                  switch (type) {

                    case "RECT":
                      let gFirstFeatureRect = new AILabel.Feature.Rect(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureRect);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureRect
                      );
                      break;


                    case "DRAW":
                      let gFirstMask = new AILabel.Layer.Mask(
                          id, // id
                          //shape, // shape
                          props, // props
                          style // style
                      );

                      const drawMaskAction = new AILabel.Mask.Draw(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );

                      this.gMap.getLayers()[1].addAction(drawMaskAction);

                      this.layers[0].allFeatures.push(drawMaskAction);
                      break;
                    default:
                      console.log("nonono");
                  }
                }
              }
            }
          }
        });
      }
      this.index = this.activeLayer - 1;
      this.layers[this.index].style = this.style;
      this.dialogVisible = false;
      if (this.activeLayer == this.index + 1) {
        this.drawingStyle = this.layers[this.index].style;
      }
      //console.log(this.layers[this.index].style);
    },
    setStyle2() {
      // this.layers[this.index].style = this.style;
      // this.dialogVisible = false;
      // if (this.activeLayer == this.index + 1) {
      //   this.drawingStyle = this.layers[this.index].style;
      // }
      // //console.log(this.layers[this.index].style);
      // 如果是涂抹涂层的话，要判断一下颜色
      // 将所有的颜色改为指定颜色。
      // 颜色不是初始值，则将涂抹颜色赋给当前的样式
      if(this.layers[this.index].type == "DRAWMASK" && this.layers[this.index].style.hasOwnProperty('strokeStyle')){
        if(this.layers_stroke[this.index] != this.style.strokeStyle){
          // this.style.strokeStyle = this.layers[this.index].style.strokeStyle;
          // this.setMode("PAN");
          // this.$alert("此操作会更改当前涂抹涂层的颜色，是否继续");
          this.$confirm("此操作会更改当前涂抹涂层的颜色，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
              .then(() => {
                // 将缩略图颜色改为指定颜色添加到图片中
                this.layers_stroke[this.index] = this.style.strokeStyle;
                this.layers[this.index].style = this.style;
                this.changePicColor(this.index);
                this.dialogVisible = false;
                if (this.activeLayer == this.index + 1) {
                  this.drawingStyle = this.layers[this.index].style;
                }
                this.active(this.index);
              })
              .catch(() => {
                this.layers[this.index].style.strokeStyle = this.layers_stroke[this.index];
                this.style.strokeStyle = this.layers_stroke[this.index];
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
        }else{
          // 只改了宽度，没有改颜色
          this.layers[this.index].style = this.style;
          this.dialogVisible = false;
          if (this.activeLayer == this.index + 1) {
            this.drawingStyle = this.layers[this.index].style;
          }
          this.active(this.index);
        }
      }else{
        // 不是涂抹层或者是涂抹层但是还没有设定颜色值
        // console.log("layers",this.layers[this.index].style.strokeStyle);
        // console.log(this.style.strokeStyle);
        this.layers_stroke[this.index] = this.style.strokeStyle;
        this.layers[this.index].style = this.style;
        this.dialogVisible = false;
        if (this.activeLayer == this.index + 1) {
          this.drawingStyle = this.layers[this.index].style;
        }
        this.active(this.index);
        //console.log(this.layers[this.index].style);
      }
    },
    setStyle() {
      this.dialogVisible = true;
      this.index = this.activeLayer - 1;
      // if(this.layers[this.index].type == "DRAWMASK") {
      //   this.fillstyleVisible = false;
      //   for (let i = 0; i < this.layers.length; i++) {
      //     if (this.layers[i].style.hasOwnProperty('strokeStyle')) {
      //       // this.layers_stroke[i] = this.layers[i].style.strokeStyle;
      //     } else {
      //       this.layers_stroke[i] = "unknow";
      //     }
      //   }
      // }
      // else{
      //     this.fillstyleVisible = true;
      //   }
    },
    // setAttri1() {
    //   this.dialogFormVisible = false;
    // },
    setAttri() {
      this.dialogFormVisible = true;
      this.formAttris = Object.getOwnPropertyNames(this.form).sort();
    },
    //当前选中的属性
    activeForm(item) {
      this.formid = item;
    },
    //弹出删除属性提示框
    delAttri0() {
      if (this.formid == "") {
        this.$message({
          message: "请正确选择要删除的属性",
          type: "error",
        });
      } else {
        this.dialogDelFormVisible = true;
      }
    },
    //删除当前属性
    delAttri() {
      let i, j, ki, kj;
      let iflag = false,
        jflag = false;
      console.log("this.formid = " + this.formid);
      //判斷属性集合中是否存在当前属性
      for (i = 0; i < this.attris.length; i++) {
        if (this.attris[i].name == this.formid) {
          ki = i;
          iflag = true;
        }
      }
      //判斷属性表是否存在当前属性
      for (j = 0; j < this.formAttris.length; j++) {
        if (this.formAttris[j] == this.formid) {
          j;
          kj = j;
          jflag = true;
        }
      }
      //删除图片属性集中的当前属性
      if (jflag && iflag) {
        this.attris.splice(ki, 1);
        this.formAttris.splice(kj, 1);
        delete this.form[this.formid];
        this.$message({
          message: "属性删除成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "请正确选择要删除的属性",
          type: "error",
        });
      }
      this.dialogDelFormVisible = false;
      this.formid = "";
    },
    //当前选中的属性值
    activeAttri(ord) {
      this.order = ord;
    },
    //弹出删除属性值对话框
    back(){

      this.$router.push("/task2")
    },
    delAttri2() {
      if (this.order == -1) {
        this.$message({
          message: "请正确选择要删除的属性值",
          type: "error",
        });
      } else if (this.order == 0) {
        this.$message({
          message: "要保留至少一个属性值",
          type: "error",
        });
      } else {
        this.dialogDelFormOptVisible = true;
      }
    },
    //删除当前属性值
    delAttri1() {
      if (this.order == 0) {
        this.$message({
          message: "要保留至少一个属性值",
          type: "error",
        });
      } else if (this.order == -1) {
        this.$message({
          message: "请正确选择要删除的属性值",
          type: "error",
        });
      } else {
        this.arrys.splice(this.order, 1);
        this.attri.opts.splice(this.order, 1);
        this.$message({
          message: "属性值删除成功",
          type: "success",
        });
      }
      this.dialogDelFormOptVisible = false;
      this.order = -1;
    },
    //添加属性值的框框
    addAttri2() {
      this.arrys.push(0);
    },
    //添加属性
    addAttri1() {
      console.log("addAttri1.........");
      let flag = true;
      for (let i = 0; i < this.attris.length; i++) {
        // if (this.attris[i].name == '') {
        //   this.$message({
        //   message: "属性名不可为空",
        //   type: "error",
        // });
        //   flag = false;
        // }else
        if (this.attris[i].name == this.attri.name) {
          this.$message({
            message: "属性名不可重复或为空",
            type: "error",
          });
          flag = false;
        }
      }
      if (flag) {
        this.attris.push({
          name: this.attri.name,
          opts: [],
        });
        let n = this.attris.length;
        console.log("现有属性集" + this.attris);
        for (let m = 0; m < this.attri.opts.length; m++) {
          // console.log(this.attri.opts.length);
          // console.log(this.attri.opts);
          if (this.attri.opts[m] != " ") {
            // console.log(this.attri.opts)
            this.attris[n - 1].opts.push(this.attri.opts[m]);
          }
        }
        // 将第一个属性值作为所添加的属性的选择
         this.$set(this.form, this.attri.name, this.attri.opts[0]);
        //将图片的属性的属性名给formAttris，在设置属性的对话框中显示
        this.formAttris = Object.getOwnPropertyNames(this.form).sort();
        this.attri = this.attrii; //清空綁定值
        this.arrys = this.arrysi;
        this.dialogAttriVisible = false;

      }
    },
    //弹出添加属性对话框
    addAttri() {
      this.attri = { name: "", opts: [] }; //清空綁定值
      this.arrys = [0, 1];
      this.dialogAttriVisible = true;
    },
    //弹出保存属性集对话框
    SaveAttri0() {
      this.dialogSaveFormVisible = true;
    },
    //深克隆属性集
    deepClone(o) {
      let result;
      if (Array.isArray(o)) {
        result = [];
        for (let i = 0; i < o.length; i++) {
          result.push(this.deepClone(o[i]));
        }
      } else if (typeof o == "object") {
        result = {};
        for (let k in o) {
          result[k] = this.deepClone(o[k]);
        }
      } else {
        result = o;
      }
      return result;
    },
    //保存属性集
    SaveAttri() {

      let item;
      if (this.attrissName == "") {
        this.$message({
          message: "属性集名不可为空",
          type: "error",
        });
      } else {
        let iflag = 1;
        item = { name: "", attris: [] };
        for (let i = 0; i < this.attriss.length; i++) {
          if (this.attrissName == this.attriss[i].name) {
            iflag = 0;
            break;
          }
        }
        if (iflag == 0) {
          this.$message({
            message: "属性集名不可重复",
            type: "error",
          });
        } else {
          item.name = this.attrissName;
          // item.attris = this.attris;  //后面要改成深克隆
          item.attris = this.deepClone(this.attris);
          const that = this;
          let data = JSON.stringify(that.attriss);
          let whole = JSON.stringify({
            username: window.sessionStorage.getItem("username"),
            data: item,
          });
          this.$axios({
            //请求类型
            method: "POST",
            //URL
             url: "/api/saveUserProperty/",
            //设置请求体
            data: whole,
          })
            .then((response) => {
              console.log(response.data);
              if (response.data == "保存成功") {
                that.$alert("保存成功");
                this.attriss.push(item);
                console.log("添加后属性集合为：" + this.attriss);
                console.log(this.attriss);
              }
            })
            .catch(function (error) {
              that.$alert("保存失败");
            });
          this.attrissName = "";
          this.dialogSaveFormVisible = false;
          item = { name: "", attris: [] };
        }
      }
    },
    //弹出选择属性集对话框
    SelAttri0() {
      this.attriss = [];
      let that = this;
      let data = JSON.stringify(window.sessionStorage.getItem("username"));
      this.$axios({
        //请求类型
        method: "POST",
        //URL
         url: "/api/getUserProperty/",
        //设置请求体
        data: data,
      })
        .then((response) => {
          this.dialogSelFormVisible = true;
          // let data2 = response.data.replace(/'/g, '"');
          let data1 = response.data;
          let data3 = [];
          for (let obj in data1) {
            data3.push(JSON.parse(data1[obj].replace(/'/g, '"')));
          }
          console.log("data3:", data3);
          console.log("-------------------", response.data);
          // that.attriss = JSON.parse(data1);
          console.log("+++++++++++++++++++++++++++++++++++++++++" + data1["0"]);
          console.log("data1[1]" + data1[1]);
          that.attriss = data3;
          that.everyAttrissName = [];
          console.log("当前属性集合为：" + that.attriss);
          console.log(that.attriss);
          console.log(that.attriss.length);
          console.log(that.attriss[0]);
          console.log(that.attriss[0][7]);
          for (let i = 0; i < that.attriss.length; i++) {
            if (that.attriss[i].name != "" || that.attriss[i].name != null) {
              console.log(
                "attriss的第" + i + "个属性集合的名字为" + that.attriss[i].name
              );
              that.everyAttrissName.push(that.attriss[i].name);
            }
          }
          console.log("当前属性集合名称为：" + that.everyAttrissName);
        })
        .catch(function (error) {
          that.$alert(error);
        });
    },
    //弹出确定更换属性集对话框
    SelAttri1() {
      if (this.activeAttrissName == "") {
        this.$message({
          message: "请正确选择要更换的属性集",
          type: "error",
        });
      } else {
        this.dialogChangeFormVisible = true;
      }
    },
    //当前选中的属性集
    activeAttriss(item) {
      this.activeAttrissName = item;
    },
    //选择属性集
    SelAttri() {
      // console.log(this.activeAttrissName);
      // console.log("当前属性集合attris为：");
      // console.log(this.attris);

      if (this.activeAttrissName == "") {
        this.$message({
          message: "请正确选择要更换的属性集",
          type: "error",
        });
      } else {
        for (let i = 0; i < this.attriss.length; i++) {
          if (this.attriss[i].name == this.activeAttrissName) {
            // console.log("要更换的属性集合attriss[i].attris为：");
            // console.log(this.attriss[i].attris);
            // this.attris = this.attriss[i].attris; //后面要改成深克隆
            this.attris = this.deepClone(this.attriss[i].attris);
            //更改form
            this.form = {};
            for (let j = 0; j < this.attris.length; j++) {
              if (this.attris[j].name != "") {
                this.$set(
                  this.form,
                  this.attris[j].name,
                  this.attris[j].opts[0]
                );
              }
            }
            console.log(this.form);
            //将图片的属性的属性名给formAttris，在设置属性的对话框中显示
            this.formAttris = Object.getOwnPropertyNames(this.form).sort();
            this.$message({
              message: "属性集更换成功",
              type: "success",
            });
            this.dialogChangeFormVisible = false;
            this.dialogSelFormVisible = false;
            this.activeAttrissName = "";
          }
        }
      }
    },
    checkName(index) {
      for (let i = 0; i < this.layers.length; i++) {
        if (i != index) {
          if (this.layers[i].name == this.layers[index].name) {
            alert("图层名字不可重复!");
            this.layers[index].name = this.layers[index].id + "";
          }
        }
      }
    },
    isText() {
      if (!this.isButton) this.isButton = true;
    },
    changeContent(index) {
      if (this.isButton) this.isButton = false;
      for (let i = 0; i < this.layers.length; i++) {
        if (i != index) {
          if (this.layers[i].name == this.layers[index].name) {
            alert("图层名字不可重复!");
            this.layers[index].name = this.layers[index].id + "";
          }
        }
      }
    },
    changeType(index) {
      this.$confirm("此操作将永久删除该方式的标注内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.hide(index);
          this.layers[index].allFeatures = [];
          this.setMode(this.layers[index].type);
          console.log(this.type);
          let arrFilter = this.types.filter(
            (ele) => ele.value == this.layers[index].type
          );
          console.log(arrFilter);
          this.layers[index].svgcode = arrFilter[0].logoImg;
        })
        .catch(() => {
          this.layers[index].type = this.type;
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    tiShi(callback, type) {
      if (callback) {
        this.type = type;
      }
    },
    deleteLay() {
      const id = this.layers[this.activeLayer - 1].id;
      this.gMap.removeLayerById(id);
      this.layers.splice(this.activeLayer - 1, 1);
    },
    checkThis(index) {
      this.id = index;
      this.activeImage = this.imgUrl[index].url.split(
        "/"
      )[7];
      console.log(this.activeImage);
      this.gMap.removeAllLayers();
      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].allFeatures = [];
      }

      const gFirstImageLayer = new AILabel.Layer.Image(
        "first-layer-image", // id
        {
          src: this.imgUrl[index].url,
          width: 500,
          height:354,
          crossOrigin: true, // 如果跨域图片，需要设置为true
          position: {
            // 左上角相对中心点偏移量
            x: 0,
            y: 0,
          },
          grid: {
            // 3 * 3
            columns: [{ color: "#9370DB" }, { color: "#FF6347" }],
            rows: [{ color: "#9370DB" }, { color: "#FF6347" }],
          },
        }, // imageInfo
        { name: "第一个图片图层" }, // props
        { zIndex: 5 } // style
      );
      this.gMap.addLayer(gFirstImageLayer);

      const gFirstMaskLayer = new AILabel.Layer.Mask(
        "first-layer-mask", // id
        { name: "第一个涂抹图层" }, // props
        { zIndex: 11, opacity: 0.5 } ,// style
           {type:"3"}
      );
      this.gMap.addLayer(gFirstMaskLayer);

      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].imgArr =
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F29381f30e924b899e7b98bc669061d950b7bf643.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638415117&t=10ad7679c9c07316fa9ecb143a1e813e";
        const FeatureLayer = new AILabel.Layer.Feature(
          this.layers[i].id, // id
          { name: "矢量图层" }, // props
          { zIndex: 20 } // style
        );
        this.gMap.addLayer(FeatureLayer);
      }
    },
    submitPicture_check(index1) {

      const that = this
      const username = window.sessionStorage.getItem("username");
      const index = window.sessionStorage.getItem("index");
      const filename=this.activeImage;
      const id = this.proid
      const name=this.name;

      let map = document.querySelector("#map");
      domtoimage.toPng(map).then(function (dataUrl) {
        // var img = new Image();
        // img.src = dataUrl;
        // console.log(dataUrl);
        var fd = new FormData();
        fd.append("file", dataUrl);//图片
        fd.append("username", username);//标注员姓名
        fd.append("index", index);//项目index
        fd.append("name",name);//项目名
        fd.append("filename",filename)//图片名
        fd.append("proid",id)
        // console.log(fd.get("file"));
        // console.log(fd.get("username"));
        // console.log(fd.get("index"));
        // console.log(fd.get("name"));
        // console.log(fd.get("filename"));
        that
            .$axios({
              //请求类型
              method: "POST",
              //URL
              url: "/api/savetaggedpic/",
              //设置请求体
              data: fd,
            })
            .then((response) => {
            //  console.log(response.data);
           //   console.log(this);
              if (response.data === "保存成功") {
                let data = JSON.stringify({
                  username: username,
                  id: id,
                  name: name
                });
                that.$axios({
                  //请求类型
                  method: "POST",
                  //URL
                  url: "/api/updaterate/",
                  //设置请求体
                  data: data,
                }).then((response) => {
                  console.log(response);
                  if (response.data === "ok") {
                    that.$axios({
                      //请求类型
                      method: "POST",
                      //URL
                      url: "/api/getpersonalproject/",
                      //设置请求体
                      data: username,
                    }).then((response) => {
                      let data = response.data;

                      that.tasks = data;
                    });

                  }
                });


              } else {
                that.$message.error("提交失败");

              }

            });

        that.checkThis1(index1)

      });

    },

    checkThis1(index1) {
      console.log(this.gMap.zoom)
      const that = this
      this.showMsg=false
      this.id = index1;
      this.activeImage = this.projectImgs[index1].split(
          "/"
      )[7];
      console.log(this.activeImage);
      this.gMap.removeAllLayers();
      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].allFeatures = [];
      }
      var fd = new FormData();
      fd.append("file", this.projectImgs[index1]);//图片
      that
          .$axios({
            //请求类型
            method: "POST",
            //URL
            url: "/api/returnSize/",
            //设置请求体
            data: fd,
          }).then((response) => {
        that.width=response.data['width']
        that.height=response.data['height']
        console.log(that.width)
        console.log(that.height)

        const gFirstImageLayer = new AILabel.Layer.Image(
            "first-layer-image", // id
            {
              src: this.projectImgs[index1],
              width: this.width,
              height:this.height,
              crossOrigin: true, // 如果跨域图片，需要设置为true
              position: {
                // 左上角相对中心点偏移量
                x: 0,
                y: 0,
              },

            }, // imageInfo
            { name: "第一个图片图层" }, // props
            { zIndex: 5 } // style
        );
        this.gMap.addLayer(gFirstImageLayer);
        const gFirstMaskLayer = new AILabel.Layer.Mask(
            "first-layer-mask", // id
            { name: "第一个涂抹图层" }, // props
            { zIndex: 11, opacity: 0.5 } // style
        );
        this.gMap.addLayer(gFirstMaskLayer);

        for (let i = 0; i < this.layers.length; i++) {
          this.layers[i].imgArr =
              "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F29381f30e924b899e7b98bc669061d950b7bf643.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638415117&t=10ad7679c9c07316fa9ecb143a1e813e";
          const FeatureLayer = new AILabel.Layer.Feature(
              this.layers[i].id, // id
              { name: "矢量图层" }, // props
              { zIndex: 20 } // style
          );
          this.gMap.addLayer(FeatureLayer);
        }
        this.showMsg=true
        this.reproduceThis()
      })





    },
    preserveThis() {
      let allFeatures = "";
      if(this.protype==9) {

        let all1 = this.gMap.getLayers()[1].getAllActions()
        console.log(this.layers[0].allFeatures)
        //console.log(all1[0].type)

        for (let i = 0; i < all1.length; i++) {
          allFeatures += "id:\n";
          allFeatures += all1[i].id;
          allFeatures += "\n";
          allFeatures += "type:\n";
          allFeatures += all1[i].type;
          allFeatures += "\n";
          allFeatures += "shape:\n";
          allFeatures += JSON.stringify(all1[i].shape);
          allFeatures += "\n";
          allFeatures += "props:\n";
          allFeatures += JSON.stringify(all1[i].props);
          allFeatures += "\n";
          allFeatures += "style:\n";
          allFeatures += JSON.stringify(all1[i].style);
          allFeatures += "\n----------\n";

        }
        allFeatures += "\n****************\n";
      }
      if(this.protype==6) {

        for (let j = 0; j < this.layers.length; j++) {
          allFeatures += "lay:\n";
          allFeatures += this.layers[j].name;
          allFeatures += "\n";
          // let gFirstFeatureLayer = this.gMap.getLayers()[j + 2];
          let gFirstFeatureLayer = this.gMap.getLayers()[j + 2];
          console.log(gFirstFeatureLayer)
          let all = gFirstFeatureLayer.getAllFeatures();
          for (let i = 0; i < all.length; i++) {
            allFeatures += "id:\n";
            allFeatures += all[i].id;
            allFeatures += "\n";
            allFeatures += "type:\n";
            allFeatures += all[i].type;
            allFeatures += "\n";
            allFeatures += "shape:\n";
            allFeatures += JSON.stringify(all[i].shape);
            allFeatures += "\n";
            allFeatures += "props:\n";
            allFeatures += JSON.stringify(all[i].props);
            allFeatures += "\n";
            allFeatures += "style:\n";
            allFeatures += JSON.stringify(all[i].style);
            allFeatures += "\n----------\n";
          }
          allFeatures += "\n****************\n";
        }
      }
        if(this.protype==6||this.protype==9) {
          let aData = new Date();
          let m = aData.getMonth() + 1
          m = m < 10 ? ('0' + m) : m;
          let d = aData.getDate();
          d = d < 10 ? ('0' + d) : d;
          let h = aData.getHours();
          let minute = aData.getMinutes();
          minute = minute < 10 ? ('0' + minute) : minute;
          let seconds = aData.getSeconds();
          seconds = seconds < 10 ? ('0' + seconds) : seconds;
          let dateValue = aData.getFullYear() + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + seconds;
          let key = this.activeImage;
          console.log(key)
          var data = {};
          data[key.replace(/\+/g,"%2B")] = allFeatures;
          data['update'] = dateValue
          data['belongproject'] = this.proid
          data['name'] = key.replace(/\+/g,"%2B")

          data = JSON.stringify(data);

          const that = this;

          this.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "/api/saveData/",
            //设置请求体
            data: data,

          }).then((response) => {
            //console.log(response.data);
            // console.log(this.imgUrl[index].url);
            if (response.data == "保存了") {
              console.log("保存成功");
            }
          });
        }
        else if(this.protype==4||this.protype==5){
          let key = this.activeImage;
          let aData = new Date();
          let m = aData.getMonth() + 1
          m = m < 10 ? ('0' + m) : m;
          let d = aData.getDate();
          d = d < 10 ? ('0' + d) : d;
          let h = aData.getHours();
          let minute = aData.getMinutes();
          minute = minute < 10 ? ('0' + minute) : minute;
          let seconds = aData.getSeconds();
          seconds = seconds < 10 ? ('0' + seconds) : seconds;
          let dateValue = aData.getFullYear() + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + seconds;
          this.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "/api/saveAttri/",
            //设置请求体
            data: {'name':key,
                   'attri': this.radio,
                   'belongproject':this.proid,
                   'update':dateValue
            },
          }).then((response) => {
            console.log(response.data);
            // console.log(this.imgUrl[index].url);
            if (response.data == "保存了") {
              console.log("保存成功");
            }
          });
        }
        else if (this.protype==3)
        {
          let key = this.activeImage;
          console.log(this.form)
          console.log(this.formAttris)
          let aData = new Date();
          let m = aData.getMonth() + 1
          m = m < 10 ? ('0' + m) : m;
          let d = aData.getDate();
          d = d < 10 ? ('0' + d) : d;
          let h = aData.getHours();
          let minute = aData.getMinutes();
          minute = minute < 10 ? ('0' + minute) : minute;
          let seconds = aData.getSeconds();
          seconds = seconds < 10 ? ('0' + seconds) : seconds;
          let dateValue = aData.getFullYear() + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + seconds;
          console.log(dateValue)
          this.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "/api/saveAttri1/",
            //设置请求体
            data: {'name':key,
              'attri': this.form,
              'belongproject':this.proid,
              'update':dateValue
            },
          }).then((response) => {
          //  console.log(response.data);
            // console.log(this.imgUrl[index].url);
            if (response.data == "保存了") {
              console.log("保存成功");
            }
          });
        }


    },
    reproduceThis() {
      console.log(this.protype);
      if(this.protype==6) {
        let data = this.activeImage;
        this.$axios({
          //请求类型
          method: "POST",
          //URL
          url: "/api/returnData1/",
          //设置请求体
          data: data.replace(/\+/g,"%2B"),
        }).then((response) => {
          //console.log(response.data);
          const result = response.data['txt'];
          const update = response.data['update']
          const allLayers = result.split("\n****************\n");
          //console.log(allLayers);
          this.update=update
          for (let j = 0; j < allLayers.length - 1; j++) {
            let name = allLayers[j].split("\n")[1];
            let exit = false;
            let number = 0;
            for (let k = 0; k < this.layers.length; k++) {
              if (this.layers[k].name == name) {
                exit = !exit;
                number = k;
              }
            }
            if (exit) {
              let lay = this.gMap.getLayers()[number + 2];
              const allMark = allLayers[j].split("\n----------\n");
             // console.log(allMark);
              for (let i = 0; i < allMark.length - 1; i++) {
                const allAttribute = allMark[i].split("\n");
                let id, type, shape, props, style;
                if (i == 0) {
                  id = allAttribute[3];
                  type = allAttribute[5];
                  shape = JSON.parse(allAttribute[7]);
                  props = JSON.parse(allAttribute[9]);
                  style = JSON.parse(allAttribute[11]);
                } else {
                  id = allAttribute[1];
                  type = allAttribute[3];
                  shape = JSON.parse(allAttribute[5]);
                  props = JSON.parse(allAttribute[7]);
                  style = JSON.parse(allAttribute[9]);
                }
                //console.log(id, type, shape, props, style);
                switch (type) {
                  case "POINT":
                    let gFirstFeaturePoint = new AILabel.Feature.Point(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeaturePoint);
                    this.layers[number].allFeatures.push(gFirstFeaturePoint);
                    break;
                  case "LINE":
                    let gFirstFeatureLine = new AILabel.Feature.Line(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeatureLine);
                    this.layers[number].allFeatures.push(gFirstFeatureLine);
                    break;
                  case "POLYLINE":
                    let polylineFeature = new AILabel.Feature.Polyline(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(polylineFeature);
                    this.layers[number].allFeatures.push(polylineFeature);
                    break;
                  case "RECT":
                    let gFirstFeatureRect = new AILabel.Feature.Rect(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeatureRect);
                    this.layers[number].allFeatures.push(gFirstFeatureRect);
                    break;
                  case "POLYGON":
                    let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeaturePolygon);
                    this.layers[number].allFeatures.push(gFirstFeaturePolygon);
                    break;
                  case "CIRCLE":
                    let gFirstFeatureCircle = new AILabel.Feature.Circle(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    lay.addFeature(gFirstFeatureCircle);
                    this.layers[number].allFeatures.push(gFirstFeatureCircle);
                    break;
                  case "DRAW":
                    let gFirstMask = new AILabel.Layer.Mask(
                        id, // id
                        //shape, // shape
                        props, // props
                        style // style
                    );

                    const drawMaskAction = new AILabel.Mask.Draw(
                        id, // id
                        shape, // shape
                        props, // props
                        style // style
                    );
                    this.gMap.getLayers()[1].addAction(drawMaskAction);

                    this.layers[0].allFeatures.push(drawMaskAction);
                    break;

                  default:
                    console.log("nonono");
                }
              }
            } else {
              if (this.protype == 6) {
                const id = this.layers.length + "";


                const lay = new AILabel.Layer.Feature(
                    id, // id
                    {name: "矢量图层"}, // props
                    {zIndex: 20} // style
                );
                this.gMap.addLayer(lay);


                this.layers.push({
                  id: id,
                  allFeatures: [],
                  exit: true,
                  name: name,
                });
                const allMark = allLayers[j].split("\n----------\n");
                //console.log(allMark);

                for (let i = 0; i < allMark.length - 1; i++) {
                  const allAttribute = allMark[i].split("\n");
                  console.log(allAttribute)
                  let id, type, shape, props, style;
                  if (i == 0) {
                    id = allAttribute[3];
                    type = allAttribute[5];
                    shape = JSON.parse(allAttribute[7]);
                    props = JSON.parse(allAttribute[9]);
                    style = JSON.parse(allAttribute[11]);
                  } else {
                    id = allAttribute[1];
                    type = allAttribute[3];
                    shape = JSON.parse(allAttribute[5]);
                    props = JSON.parse(allAttribute[7]);
                    style = JSON.parse(allAttribute[9]);
                  }
                  //console.log(id, type, shape, props, style);
                  switch (type) {
                    case "POINT":
                      let gFirstFeaturePoint = new AILabel.Feature.Point(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeaturePoint);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeaturePoint
                      );
                      break;
                    case "LINE":
                      let gFirstFeatureLine = new AILabel.Feature.Line(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureLine);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureLine
                      );
                      break;
                    case "POLYLINE":
                      let polylineFeature = new AILabel.Feature.Polyline(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(polylineFeature);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          polylineFeature
                      );
                      break;
                    case "RECT":
                      let gFirstFeatureRect = new AILabel.Feature.Rect(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureRect);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureRect
                      );
                      break;
                    case "POLYGON":
                      let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeaturePolygon);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeaturePolygon
                      );
                      break;
                    case "CIRCLE":
                      let gFirstFeatureCircle = new AILabel.Feature.Circle(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureCircle);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureCircle
                      );
                      break;
                    case "DRAW":
                      let gFirstMask = new AILabel.Layer.Mask(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addLayer(gFirstMask);
                      this.layers[number].allFeatures.push(gFirstMask);
                      break;
                    default:
                      console.log("nonono");
                  }
                }
              }
              else {
                const id = this.layers.length + "";
                const lay = new AILabel.Layer.Mask(
                    id, // id
                    {name: "矢量图层"}, // props
                    {zIndex: 20, opacity: .5} // style
                );
                this.gMap.addLayer(lay);


                this.layers.push({
                  id: id,
                  allFeatures: [],
                  exit: true,
                  name: name,
                });
                const allMark = allLayers[j].split("\n----------\n");
                //console.log(allMark);

                for (let i = 0; i < allMark.length - 1; i++) {
                  const allAttribute = allMark[i].split("\n");
                  console.log(allAttribute)
                  let id, type, shape, props, style;
                  if (i == -1) {
                    id = allAttribute[3];
                    type = allAttribute[5];
                    shape = JSON.parse(allAttribute[7]);
                    props = JSON.parse(allAttribute[9]);
                    style = JSON.parse(allAttribute[11]);
                  } else {
                    id = allAttribute[1];
                    type = allAttribute[3];
                    shape = JSON.parse(allAttribute[5]);
                    props = JSON.parse(allAttribute[7]);
                    style = JSON.parse(allAttribute[9]);
                  }
                  console.log(id, type, shape, props, style);
                  switch (type) {
                    case "POINT":
                      let gFirstFeaturePoint = new AILabel.Feature.Point(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeaturePoint);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeaturePoint
                      );
                      break;
                    case "LINE":
                      let gFirstFeatureLine = new AILabel.Feature.Line(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureLine);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureLine
                      );
                      break;
                    case "POLYLINE":
                      let polylineFeature = new AILabel.Feature.Polyline(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(polylineFeature);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          polylineFeature
                      );
                      break;
                    case "RECT":
                      let gFirstFeatureRect = new AILabel.Feature.Rect(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureRect);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureRect
                      );
                      break;
                    case "POLYGON":
                      let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeaturePolygon);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeaturePolygon
                      );
                      break;
                    case "CIRCLE":
                      let gFirstFeatureCircle = new AILabel.Feature.Circle(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );
                      lay.addFeature(gFirstFeatureCircle);
                      this.layers[this.layers.length - 1].allFeatures.push(
                          gFirstFeatureCircle
                      );
                      break;
                    case "DRAW":
                      let gFirstMask = new AILabel.Layer.Mask(
                          id, // id
                          //shape, // shape
                          props, // props
                          style // style
                      );

                      const drawMaskAction = new AILabel.Mask.Draw(
                          id, // id
                          shape, // shape
                          props, // props
                          style // style
                      );

                      this.gMap.getLayers()[1].addAction(drawMaskAction);

                      this.layers[0].allFeatures.push(drawMaskAction);
                      break;
                    default:
                      console.log("nonono");
                  }
                }
              }
            }
          }
        });
      }
     else if(this.protype==9) {
        let data = this.activeImage;
        this.$axios({
          //请求类型
          method: "POST",
          //URL
          url: "/api/returnData/",
          //设置请求体
          data: data.replace(/\+/g,"%2B"),
        }).then((response) => {
          //console.log(response.data);
          const result = response.data['txt'].split("\n****************\n");
          const allMark = result[0].split("\n----------\n");
          this.update = response.data['update']
          for (let i = 0; i < allMark.length - 1; i++) {
          //  console.log(allMark[i]);
            const allAttribute = allMark[i].split("\n");
            let id, type="", shape, props, style;
            id = allAttribute[1];
            type = allAttribute[3];
            shape = JSON.parse(allAttribute[5]);
            props = JSON.parse(allAttribute[7]);
            style = JSON.parse(allAttribute[9]);
            console.log(id, type, shape, props, style);
            console.log("==========================")
            console.log(type)
           if(type=='DRAW') {
             const drawMaskAction = new AILabel.Mask.Draw(
                 id, // id
                 type,
                 shape, // shape
                 props, // props
                 style // style
             );

             this.gMap.getLayers()[1].addAction(drawMaskAction);

             this.layers[0].allFeatures.push(drawMaskAction);
           }
            else {
              const drawMaskAction = new AILabel.Mask.Clear(
                  id, // id
                //  type,
                  shape, // shape
                // props, // props
                 // style // style
              );

              this.gMap.getLayers()[1].addAction(drawMaskAction);

              this.layers[0].allFeatures.push(drawMaskAction);
            }
            let all1 = this.gMap.getLayers()[1].getAllActions()
            console.log(all1)
          }
          console.log(this.layers[0].allFeatures)

        });
      }
      else if (this.protype==4)
      {
        let data = this.activeImage;
       // console.log(data)
        this.$axios({
          //请求类型
          method: "POST",
          //URL
          url: "/api/returnArriData/",
          //设置请求体
          data: {'name':data},
        }).then((response) => {
          console.log(response.data);
          this.update = response.data['update']
          const result = response.data['attri'].split('"')[1]
          const net = response.data['result']
          console.log(result);
          const result1 = eval('('+result+')')
          console.log(result1['opts']);
          this.radio=result1['opts']
          this.net = net
          const items=eval('('+this.net+')')
          this.tableNet=items
         // console.log(eval('('+this.net+')'))
        });
      }
      else if (this.protype==5)
      {
        let data = this.activeImage;

        console.log(data)
        this.$axios({
          //请求类型
          method: "POST",
          //URL
          url: "/api/returnArriData/",
          //设置请求体
          data: {'name':data},
        }).then((response) => {
          console.log(response.data);
          this.update = response.data['update']
          const result = response.data['attri'].split('"')[1]
          const net = response.data['result']
          console.log(result);
          const result1 = eval('('+result+')')
          console.log(result1)
          console.log(result1['opts']);
          this.radio=result1['opts']
          this.net = net
          console.log(eval('('+this.net+')'))
          const items=eval('('+this.net+')')
          this.tableNet=items
          console.log(this.tableNet)


        });
      }
      else if (this.protype==3)
      {
        let data = this.activeImage;
        console.log(data)
        this.$axios({
          //请求类型
          method: "POST",
          //URL
          url: "/api/returnArriData1/",
          //设置请求体
          data: {'name':data},
        }).then((response) => {
          console.log(response.data);
          const result = response.data['attri']
          const update = response.data['update']
          this.update = update
          console.log(result);
          console.log(typeof (result))
          const temp =eval('('+result+')')
          console.log(temp)
          this.form=temp
        //  this.form=result

        });
      }
    },
    async exportLayer(index) {
      const lay = this.gMap.getLayers()[index + 2];
      const imagedata = await this.gMap.exportLayersToImage(
        { x: 0, y: 0, width: 500, height: 354 },
        { layers: [lay], type: "base64", format: "image/png" }
      );

      const imageDom = new Image();
      imageDom.src = imagedata;
      this.layers[index].imgArr = imagedata;
    },
    produceImg() {
      let map = document.querySelector("#map");
      domtoimage.toPng(map).then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = dataUrl;
        aLink.download = "export.png";
        // 触发点击-然后移除
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
      });

    },
    sert(str, timer) {
      this.$message({
        showClose: true,
        message: str,
        str: timer,
      });

    },
    lastImg() {
      this.showMsg=true
       this.gMap.markerLayer.removeAllMarkers();
      if (this.id == 0) {
        this.$message({
          message: "当前已是第一张",
          type: "warning",
        });
        return;
      }
      this.id--;
      console.log(this.projectImgs[this.id]);
      console.log(this.projectImgs[this.id].split("/")[7]);
      this.activeImage = this.projectImgs[this.id].split(
        "/"
      )[7];
       this.gMap.removeAllLayers();
      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].allFeatures = [];
      }
      // let imgObj = new Image()
      // imgObj.src = this.projectImgs[this.id]
      let timer = ''
      let that = this
      // timer = setInterval(() => {
      //   if (imgObj.height) {
      //     clearInterval(timer)
      //     timer = null
      //     that.width = (imgObj.width/(imgObj.width+imgObj.height))*800
      //     that.height = (imgObj.height/(imgObj.width+imgObj.height))*800
      //
      //
      //   }
      // },1)
      var fd = new FormData();
      fd.append("file", this.projectImgs[this.id]);//图片
      that
          .$axios({
            //请求类型
            method: "POST",
            //URL
            url: "/api/returnSize/",
            //设置请求体
            data: fd,
          }).then((response) => {
        that.width = response.data['width']
        that.height = response.data['height']
        console.log(that.width)
        console.log(that.height)
        const gFirstImageLayer = new AILabel.Layer.Image(
            "first-layer-image", // id
            {
              src: this.projectImgs[this.id],
              width: this.width,
              height: this.height,
              crossOrigin: true, // 如果跨域图片，需要设置为true
              position: {
                // 左上角相对中心点偏移量
                x: 0,
                y: 0,
              },

            }, // imageInfo
            { name: "第一个图片图层" }, // props
            { zIndex: 5 } // style
        );
        this.gMap.addLayer(gFirstImageLayer);
        const gFirstMaskLayer = new AILabel.Layer.Mask(
            "first-layer-mask", // id
            { name: "第一个涂抹图层" }, // props
            { zIndex: 11, opacity: 0.5 } // style
        );
        this.gMap.addLayer(gFirstMaskLayer);

        for (let i = 0; i < this.layers.length; i++) {
          this.layers[i].imgArr =
              "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F29381f30e924b899e7b98bc669061d950b7bf643.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638415117&t=10ad7679c9c07316fa9ecb143a1e813e";
          const FeatureLayer = new AILabel.Layer.Feature(
              this.layers[i].id, // id
              { name: "矢量图层" }, // props
              { zIndex: 20 } // style
          );
          this.gMap.addLayer(FeatureLayer);
        }
        this.reproduceThis()
      })

    },


    nextImg() {
      this.showMsg=true
      this.gMap.markerLayer.removeAllMarkers();
      if (this.id == this.projectImgs.length - 1) {
        this.$message({
          message: "当前已是最后一张",
          type: "warning",
        });
        return;
      }
      this.id++;
      this.activeImage = this.projectImgs[this.id].split(
          "/"
      )[7];
      this.gMap.removeAllLayers();
      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].allFeatures = [];
      }
      let that = this
      var fd = new FormData();
      fd.append("file", this.projectImgs[this.id]);//图片
      that
          .$axios({
            //请求类型
            method: "POST",
            //URL
            url: "/api/returnSize/",
            //设置请求体
            data: fd,
          }).then((response) => {
        that.width = response.data['width']
        that.height = response.data['height']
        console.log(that.width)
        console.log(that.height)
        const gFirstImageLayer = new AILabel.Layer.Image(
            "first-layer-image", // id
            {
              src: this.projectImgs[this.id],
              width: this.width,
              height:this.height,
              crossOrigin: true, // 如果跨域图片，需要设置为true
              position: {
                // 左上角相对中心点偏移量
                x: 0,
                y: 0,
              },
              // grid: {
              //   // 3 * 3
              //   columns: [{ color: "#9370DB" }, { color: "#FF6347" }],
              //   rows: [{ color: "#9370DB" }, { color: "#FF6347" }],
              // },
            }, // imageInfo
            { name: "第一个图片图层" }, // props
            { zIndex: 5 } // style
        );
        this.gMap.addLayer(gFirstImageLayer);

        const gFirstMaskLayer = new AILabel.Layer.Mask(
            "first-layer-mask", // id
            { name: "第一个涂抹图层" }, // props
            { zIndex: 11, opacity: 0.5 } // style
        );
        this.gMap.addLayer(gFirstMaskLayer);

        for (let i = 0; i < this.layers.length; i++) {
          this.layers[i].imgArr =
              "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F29381f30e924b899e7b98bc669061d950b7bf643.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638415117&t=10ad7679c9c07316fa9ecb143a1e813e";
          const FeatureLayer = new AILabel.Layer.Feature(
              this.layers[i].id, // id
              { name: "矢量图层" }, // props
              { zIndex: 20 } // style
          );
          this.gMap.addLayer(FeatureLayer);
        }
        this.reproduceThis()
      })

    },
    addMaskLayer() {
      const id = this.layers.length + "";
      // const FeatureLayer = new AILabel.Layer.Feature(
      //   id, // id
      //   { name: "矢量图层" }, // props
      //   { zIndex: 20 } // style
      // );
      // this.gMap.addLayer(FeatureLayer);
      const MaskLayer = new AILabel.Layer.Mask(
          'first-layer-mask', // id
          {name: '涂抹图层'}, // props
          {zIndex: 11, opacity: .5} // style
      );
      this.gMap.addLayer(MaskLayer);
      this.layers.push({
        id: id,
        allFeatures: [],
        svgcode:
            "M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z",
        exit: true,
        name: id + "",
        style: {},
        type: "PAN",
      });
      this.addLOMVisible = false;
    },
    submitPicture() {
      const username = window.sessionStorage.getItem("username");
      const index = window.sessionStorage.getItem("index");
      const filename=this.activeImage;
      const id = this.proid
      const name=this.name;
      let that = this;
      let map = document.querySelector("#map");
      domtoimage.toPng(map).then(function (dataUrl) {
        // var img = new Image();
        // img.src = dataUrl;
        // console.log(dataUrl);
        var fd = new FormData();
        fd.append("file", dataUrl);//图片
        fd.append("username", username);//标注员姓名
        fd.append("index", index);//项目index
        fd.append("name",name);//项目名
        fd.append("filename",filename)//图片名
        fd.append("proid",id)
        // console.log(fd.get("file"));
        // console.log(fd.get("username"));
        // console.log(fd.get("index"));
        // console.log(fd.get("name"));
        // console.log(fd.get("filename"));
        console.log(fd)
        that
          .$axios({
            //请求类型
            method: "POST",
            //URL
             url: "/api/savetaggedpic/",
            //设置请求体
            data: fd,
          })
          .then((response) => {
            console.log(response.data);
            console.log(this);
            if (response.data === "保存成功") {
              let data = JSON.stringify({
                username: username,
                id: id,
                name: name
              });
              that.$axios({
                //请求类型
                method: "POST",
                //URL
                url: "/api/updaterate/",
                //设置请求体
                data: data,
              }).then((response) => {
                console.log(response);
                if (response.data === "ok") {
                  that.$axios({
                    //请求类型
                    method: "POST",
                    //URL
                    url: "/api/getpersonalproject/",
                    //设置请求体
                    data: username,
                  }).then((response) => {
                    let data = response.data;
                    console.log(data);

                    for (let i = 0; i < data.length; i++) {
                      console.log(data[i].replace(/'/g, '"'));
                      data[i] = JSON.parse(data[i].replace(/'/g, '"'));
                    }
                    //let data2 = response.data.replace(/'/g, '"');
                    console.log(data);
                    that.tasks = data;
                  });
                  that.$message({
                    message: "更新成功",
                    type: "success",
                  });
                }
              });
              that.$message({
                message: "提交成功",
                type: "success",
              });

            } else {
              that.$message.error("提交失败");

            }

          });
      });

    },
    submitPicture_l() {
      let that = this;
      this.showMsg=false
      const username = window.sessionStorage.getItem("username");
      const index = window.sessionStorage.getItem("index");
      const filename=this.activeImage;
      const id = this.proid
      const name=this.name;
      let map = document.querySelector("#map");
      domtoimage.toPng(map).then(function (dataUrl) {
        // var img = new Image();
        // img.src = dataUrl;
        // console.log(dataUrl);
        var fd = new FormData();
        fd.append("file", dataUrl);//图片
        fd.append("username", username);//标注员姓名
        fd.append("index", index);//项目index
        fd.append("name",name);//项目名
        fd.append("filename",filename)//图片名
        fd.append("proid",id)
        // console.log(fd.get("file"));
        // console.log(fd.get("username"));
        // console.log(fd.get("index"));
        // console.log(fd.get("name"));
        // console.log(fd.get("filename"));
        that
            .$axios({
              //请求类型
              method: "POST",
              //URL
              url: "/api/savetaggedpic/",
              //设置请求体
              data: fd,
            })
            .then((response) => {
              console.log(response.data);
              console.log(this);
              if (response.data === "保存成功") {
                let data = JSON.stringify({
                  username: username,
                  id: id,
                  name: name
                });
                that.$axios({
                  //请求类型
                  method: "POST",
                  //URL
                  url: "/api/updaterate/",
                  //设置请求体
                  data: data,
                }).then((response) => {
                  console.log(response);
                  if (response.data === "ok") {
                    that.$axios({
                      //请求类型
                      method: "POST",
                      //URL
                      url: "/api/getpersonalproject/",
                      //设置请求体
                      data: username,
                    }).then((response) => {
                      let data = response.data;
                      //console.log(data);
                      //
                      // for (let i = 0; i < data.length; i++) {
                      //   //console.log(data[i].replace(/'/g, '"'));
                      //   data[i] = JSON.parse(data[i].replace(/'/g, '"'));
                      // }
                      //let data2 = response.data.replace(/'/g, '"');
                      //console.log(data);
                      that.tasks = data;
                    });

                  }
                });


              } else {
                that.$message.error("提交失败");

              }

            });
        that.preserveThis()
        that.lastImg()
      });

    },
    submitPicture_back() {
      let that = this;
      const username = window.sessionStorage.getItem("username");
      const index = window.sessionStorage.getItem("index");
      const filename=this.activeImage;
      const id = this.proid
      const name=this.name;
      let map = document.querySelector("#map");
      domtoimage.toPng(map).then(function (dataUrl) {
        // var img = new Image();
        // img.src = dataUrl;
        // console.log(dataUrl);
        var fd = new FormData();
        fd.append("file", dataUrl);//图片
        fd.append("username", username);//标注员姓名
        fd.append("index", index);//项目index
        fd.append("name",name);//项目名
        fd.append("filename",filename)//图片名
        fd.append("proid",id)
        // console.log(fd.get("file"));
        // console.log(fd.get("username"));
        // console.log(fd.get("index"));
        // console.log(fd.get("name"));
        // console.log(fd.get("filename"));
        that
            .$axios({
              //请求类型
              method: "POST",
              //URL
              url: "/api/savetaggedpic/",
              //设置请求体
              data: fd,
            })
            .then((response) => {
              console.log(response.data);
            //  console.log(this);
              if (response.data === "保存成功") {
                let data = JSON.stringify({
                  username: username,
                  id: id,
                  name: name
                });
                that.$axios({
                  //请求类型
                  method: "POST",
                  //URL
                  url: "/api/updaterate/",
                  //设置请求体
                  data: data,
                }).then((response) => {
                  console.log(response);
                  if (response.data === "ok") {
                    that.$axios({
                      //请求类型
                      method: "POST",
                      //URL
                      url: "/api/getpersonalproject/",
                      //设置请求体
                      data: username,
                    }).then((response) => {
                      let data = response.data;
                      //console.log(data);

                      // for (let i = 0; i < data.length; i++) {
                      //   // console.log(data[i].replace(/'/g, '"'));
                      //   data[i] = JSON.parse(data[i].replace(/'/g, '"'));
                      // }
                      // //let data2 = response.data.replace(/'/g, '"');
                      // console.log(data);
                      that.tasks = data;
                    });

                  }
                });


              } else {
                that.$message.error("提交失败");

              }

            });
        that.preserveThis()

        that.$router.push("/task2")

      });

    },
    submitPicture_n() {
      let that = this
      this.showMsg=false
      const username = window.sessionStorage.getItem("username");
      const index = window.sessionStorage.getItem("index");
      const filename=this.activeImage;
      const id = this.proid
      const name=this.name;

      let map = document.querySelector("#map");
      domtoimage.toPng(map).then(function (dataUrl) {
        // var img = new Image();
        // img.src = dataUrl;
        // console.log(dataUrl);
        var fd = new FormData();
        fd.append("file", dataUrl);//图片
        fd.append("username", username);//标注员姓名
        fd.append("index", index);//项目index
        fd.append("name",name);//项目名
        fd.append("filename",filename)//图片名
        fd.append("proid",id)
        // console.log(fd.get("file"));
        // console.log(fd.get("username"));
        // console.log(fd.get("index"));
        // console.log(fd.get("name"));
        // console.log(fd.get("filename"));
        that
            .$axios({
              //请求类型
              method: "POST",
              //URL
              url: "/api/savetaggedpic/",
              //设置请求体
              data: fd,
            })
            .then((response) => {
              console.log(response.data);
              if (response.data === "保存成功") {
                let data = JSON.stringify({
                  username: username,
                  id: id,
                  name: name
                });
                that.$axios({
                  //请求类型
                  method: "POST",
                  //URL
                  url: "/api/updaterate/",
                  //设置请求体
                  data: data,
                }).then((response) => {
                  console.log(response);
                  if (response.data === "ok") {
                    that.$axios({
                      //请求类型
                      method: "POST",
                      //URL
                      url: "/api/getpersonalproject/",
                      //设置请求体
                      data: username,
                    }).then((response) => {
                      let data = response.data;
                     // console.log(data);

                      // for (let i = 0; i < data.length; i++) {
                      //  // console.log(data[i].replace(/'/g, '"'));
                      //   data[i] = JSON.parse(data[i].replace(/'/g, '"'));
                      // }
                      // let data2 = response.data.replace(/'/g, '"');
                      //console.log(data);
                      that.tasks = data;
                    });

                  }
                });


              } else {
                that.$message.error("提交失败");

              }

            });
        that.preserveThis()
        that.nextImg()

      });

    },
    getgazeDot(){
      if(document.getElementById("webgazerGazeDot")){
        this.gazedot = window.getComputedStyle(document.getElementById("webgazerGazeDot")).transform;
      }
    }
  },
  mounted() {

    //初始化容器
    const that = this;
    window.SpeechRecognition = window.SpeechRecognition ||
            window.webkitSpeechRecognition;
    this.recognition = new window.SpeechRecognition();
    this.recording = false;

    this.recognition.continuous = true;
    this.recognition.lang = "cmn-Hans-CN";

    this.recognition.addEventListener('result', that.onSpeak);
    console.log(this.recognition);
    console.log(this.recording);

    setInterval(that.getgazeDot,1000);

    this.gMap = new AILabel.Map("map", {
      center: { x: 300, y: 220 }, // 为了让图片居中
      zoom: 2000,
      mode: "PAN", // 绘制线段
      refreshDelayWhenZooming: true, // 缩放时是否允许刷新延时，性能更优

      zoomWhenDrawing: true,
      panWhenDrawing: true,
      zoomWheelRatio: 5, // 控制滑轮缩放缩率[0, 10), 值越小，则缩放越快，反之越慢
      withHotKeys: false, // 关闭快捷键
    });

    this.gMap.events.on("drawDone", (type, data, data1) => {
      //console.log("type:", type, "data:", data);
      if (type === "MARKER") {
        const marker = new AILabel.Marker(
          Date.now(), // id
          {
            src: "http://ailabel.com.cn/public/ailabel/demo/marker.png",
            position: data,
            offset: {
              x: -16,
              y: 32,
            },
          }, // markerInfo
          { name: "第一个marker注记" } // props
        );
        marker.events.on("click", (marker) => {
          console.log("marker click");
          that.gMap.markerLayer.removeMarkerById(marker.id);
        });
        that.gMap.markerLayer.addMarker(marker);
      }
      else if (type === "POINT") {
        const pointFeature = new AILabel.Feature.Point(
          Date.now(), // id
          { ...data, sr: 3 }, // shape
          { name: "第一个矢量图层" }, // props
          this.drawingStyle // style
        );
        console.log(this.gMap.getLayers());
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(pointFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(pointFeature);
        //gFirstFeatureLayer.addFeature(pointFeature);
      }
      else if (type === "CIRCLE") {
        // console.log(data,data1)
        const circleFeature = new AILabel.Feature.Circle(
          Date.now(), // id
          data, // data1代表屏幕坐标
          { name: "第一个矢量图层" }, // props
          //{ fillStyle: "#F4A460", strokeStyle: "#D2691E", lineWidth: 2 } // style
          this.drawingStyle
        );
        console.log(this.drawingStyle);
        that.gMap.getLayers()[this.activeLayer + 1].addFeature(circleFeature);
        that.layers[this.activeLayer - 1].allFeatures.push(circleFeature);
      }
      else if (type === "LINE") {
        const scale = this.gMap.getScale();
        const width = this.drawingStyle.lineWidth / scale;
        const lineFeature = new AILabel.Feature.Line(
          Date.now(), // id
          { ...data, width }, // shape
          { name: "第一个矢量图层" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(lineFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(lineFeature);
      }
      else if (type === "POLYLINE") {
        const scale = this.gMap.getScale();
        const width = this.drawingStyle.lineWidth / scale;
        const polylineFeature = new AILabel.Feature.Polyline(
          Date.now(), // id
          { points: data, width }, // shape
          { name: "第一个矢量图层" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(polylineFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(polylineFeature);
      }
      else if (type === "RECT") {
        const rectFeature = new AILabel.Feature.Rect(
          Date.now(), // id
          data, // shape
          { name: "矢量图形" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(rectFeature);
        this.layers[this.activeLayer-1].allFeatures.push(rectFeature);
      }
      else if (type === "POLYGON") {
        const polygonFeature = new AILabel.Feature.Polygon(
          Date.now(), // id
          { points: data }, // shape
          { name: "矢量图形" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(polygonFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(polygonFeature);
      }
      else if (type === "DRAWMASK") {
        const scale = this.gMap.getScale();
        const width = this.drawingStyle.lineWidth / scale;
        const drawMaskAction = new AILabel.Mask.Draw(
          Date.now(), // id
          "铅笔",
          { points: data, width }, // shape
          { name: "港币", price: "1元" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer].addAction(drawMaskAction);
        this.layers[this.activeLayer-1].allFeatures.push(drawMaskAction);
      }
      //"CLEARMASK"
      else if (type === "CLEARMASK") {
        const scale = this.gMap.getScale();
        const width = this.drawingStyle.lineWidth / scale;
        const clearMaskAction = new AILabel.Mask.Clear(
          Date.now(), // id
          { points: data, width } // shape
        );
        this.gMap.getLayers()[this.activeLayer].addAction(clearMaskAction);
        this.layers[this.activeLayer-1].allFeatures.push(clearMaskAction);
      }
      this.exportLayer(this.activeLayer - 1);
    });
    this.gMap.events.on("featureSelected", (feature) => {

      that.gMap.setActiveFeature(feature);
      that.addDeleteIcon(feature,feature.shape)

    });
    this.gMap.events.on("featureUnselected", () => {
     that.gMap.setActiveFeature(null);
    });
    this.gMap.events.on("featureUpdated", (feature, shape) => {
      that.gMap.markerLayer.removeAllMarkers();
      that.exportLayer(this.activeLayer - 1);
      feature.updateShape(shape);

    });
    this.gMap.events.on("featureDeleted", (feature) => {
      that.gMap.getLayers()[that.activeLayer].removeFeatureById(feature.id)
    });

    const index = window.sessionStorage.getItem("index");
    // window.sessionStorage.removeItem("index");
    let data = window.sessionStorage.getItem("username");
    this.$axios({
      //请求类型
      method: "POST",
      //URL
       url: "/api/getpersonalproject/",
      //设置请求体
      data: data,
    }).then((response) => {
      let data = response.data;
     // console.log(data);
      for (let i = 0; i < data.length; i++) {
        data[i] = JSON.parse(data[i]);
        data[i].attris = JSON.parse(data[i].attris.replace(/'/g, '"'));
      }
      //console.log("data,,,,,",data);
      //更改attris
      this.attris = data[index].attris;
      //更改form
      this.form = {};
      for (let j = 0; j < data[index].attris.length; j++) {
        if (data[index].attris[j].name != "") {
          this.$set(
            this.form,
            data[index].attris[j].name,
            data[index].attris[j].opts[0]
          );
        }
      }
      //console.log(this.form);
      //将图片的属性的属性名给formAttris，在设置属性的对话框中显示
      this.formAttris = Object.getOwnPropertyNames(this.form).sort();
      //console.log(this.form);
      for (let i = 0; i < data[index].marks.length; i++) {
        this.addLayer();
        switch (data[index].marks[i]) {
          case "点": {
            this.layers[i + 1].type = "POINT";
            // this.types.push({
            //   label: "点",
            //   logoImg: "M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
            //   value: "POINT",
            // });
            break;
          }
          case "线段": {
            this.layers[i + 1].type = "LINE";
            // this.types.push({
            //   label: "线段",
            //   logoImg:
            //     "M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z",
            //   value: "LINE",
            // });
            break;
          }
          case "多线段": {
            this.layers[i + 1].type = "POLYLINE";
            // this.types.push({
            //   label: "多线段",
            //   logoImg:
            //     "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z",
            //   value: "POLYLINE",
            // });
            break;
          }
          case "矩形": {
            this.layers[i + 1].type = "RECT";
            // this.types.push({
            //   label: "矩形",
            //   logoImg:
            //     "M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z",
            //   value: "RECT",
            // });
            break;
          }
          case "多边形": {
            this.layers[i + 1].type = "POLYGON";
            // this.types.push({
            //   label: "多边形",
            //   logoImg:
            //     "M14 4.577v6.846L8 15l-6-3.577V4.577L8 1l6 3.577zM8.5.134a1 1 0 0 0-1 0l-6 3.577a1 1 0 0 0-.5.866v6.846a1 1 0 0 0 .5.866l6 3.577a1 1 0 0 0 1 0l6-3.577a1 1 0 0 0 .5-.866V4.577a1 1 0 0 0-.5-.866L8.5.134z",
            //   value: "POLYGON",
            // });
            break;
          }
          case "圆": {
            this.layers[i + 1].type = "CIRCLE";
            // this.types.push({
            //   label: "圆",
            //   logoImg:
            //     "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z",
            //   value: "CIRCLE",
            // });
            break;
          }
        }
      }



      this.projectImgs = data[index].files;
      this.name=data[index].name;
      this.activeImage = this.projectImgs[0].split(
        "/"
      )[7];
      this.checkThis1(0)



      // this.reproduceThis()
    });

    window.onresize = function () {
      this.gMap && this.gMap.resize();
    };
    // this.reproduceThis()
  },
  watch: {
    layers: {
      deep: true,
      handler() {
        this.$forceUpdate();
      },
    },
    gazedot: {
      deep: true,
      handler(){
        var webgazerGazeDot = document.getElementById("webgazerGazeDot");
        var translate = window.getComputedStyle(webgazerGazeDot).transform;
        var left = parseFloat(translate.substring(7).split(',')[4]);
        var top = parseFloat(translate.replace(")", "").substring(7).split(',')[5]);
        if(left < 75 && top > 280 && top < 335){
          if (this.id > 0) {
            this.checkThis(this.id - 1);
          } else {
            this.sert("超界", 1000);
          }
        }
        if(left > 1200 && top > 280 && top < 335){
          if (this.id < this.imgUrl.length) {
            this.checkThis(this.id + 1);
            console.log(this.id);
          } else {
            this.sert("超界", 1000);
          }
        }
      }
    }
  },
};
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0px;
}

.svgCss {
  vertical-align: 100%;
  height: 28px;
}
.el-select .el-input .el-select__caret::before {
  /*content: "\e78f"*/
  content: "";
  width: 2px;
  height: 2px;
}
.el-icon-arrow-up:before {
  content: "";
}
.selFun {
  width: 80px;
  /* display: block; */
  margin-top: 10px;
  vertical-align: 80%;
}

.logo {
  width: 10px;
  height: 10px;
}

.thumbnail {
  border: solid thin;
  /* position: relative; */
  margin-left: 30%;
  object-fit: contain;
  width: 80px;
  height: 80px;
}

.button-wrap {
  padding-bottom: 10px;
}

.box {
  display: flex;
  flex-direction: row;
}

#map {
  overflow: hidden;
  position: relative;
  height: 600px;
  width: 1300px;
  border: 1px dashed #ccc;
}

.own {
  overflow: hidden;
  background-color: rgb(239, 245, 247);
  width: 400px;
  height: 600px;
  padding: 10px;
  overflow-y: auto;
  /* position:relative; */
}

.file {
  position: relative;
  display: inline-block;
  background: rgb(236,245,255);
  border: 1px solid #d5d6d6;
  /* right: -10px; */
  top: 10px;
  border-radius: 4px;
  padding: 5px 12px;
  overflow: hidden;
  font-size: small;
  color: rgb(64, 158, 255);
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
  margin: 0px 10px -1px;
}


.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}



.attribute {
  margin-left: 10px;
}

.name {
  width: 50px;
}

.lay {
  /* Firefox */
  /* display: -moz-box;
  -moz-box-align: center; */
  /* Safari、Opera 以及 Chrome */
  /* display: -webkit-box;
  -webkit-box-align: center; */
  border: solid 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 3px;
  padding: 5px 1px;
}

.active {
  border-color: rgb(12, 12, 12);
}

.normal {
  border-color: lavender;
}

@import url(https://fonts.googleapis.com/css?family=Open+Sans);
@import url(https://fonts.googleapis.com/css?family=Montserrat:700);

h1 {
  text-align: center;
  font-family: Montserrat, sans-serif;
  color: #333;
}

.accordion {
  width: 100%;
  max-width: 1080px;
  height: 250px;
  overflow: hidden;
  margin: 50px auto;
}

.accordion ul {
  width: 100%;
  display: table;
  table-layout: fixed;
  margin: 0;
  padding: 0;
}

.accordion ul li {
  display: table-cell;
  vertical-align: bottom;
  position: relative;
  width: 16.666%;
  height: 250px;
  background-repeat: no-repeat;
  background-position: center center;
  transition: all 500ms ease;
}

.accordion ul li div {
  display: block;
  overflow: hidden;
  width: 100%;
}

.accordion ul:hover li,
.accordion ul:focus-within li {
  width: 8%;
}

.accordion ul li:focus {
  outline: none;
}

.accordion ul:hover li:hover,
.accordion ul li:focus,
.accordion ul:focus-within li:focus {
  width: 60%;
}

.accordion ul:hover li {
  width: 8% !important;
}

.accordion ul:hover li:hover {
  width: 60% !important;
}

@media screen and (max-width: 600px) {
  body {
    margin: 0;
  }

  .accordion {
    height: auto;
  }

  .accordion ul li,
  .accordion ul li:hover,
  .accordion ul:hover li,
  .accordion ul:hover li:hover {
    position: relative;
    display: table;
    table-layout: fixed;
    width: 100%;
    -webkit-transition: none;
    transition: none;
  }
}

#delete01 {

  max-width: 10%;
  height: auto;
}

.about {
  text-align: center;
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  color: #666;
}
</style>
