import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
export default function Banner() {
  return (
    <Swiper loop={true} autoplay={{ delay: 5000 }} speed={1000} modules={[Autoplay]} className="w-full h-full relative z-[0]">
      <SwiperSlide>
        <img src="https://media.hcdn.vn/hsk/1741862299homesvr1303.png" alt="" style={{overflow:"hidden", width:"100%", height:"100%"}}/>
      </SwiperSlide>
      <SwiperSlide>
<img src="https://media.hcdn.vn/hsk/1740632404hometpcn2702.jpg" alt="" className="banner-img" style={{overflow:"hidden", width:"100%", height:"100%"}}/> 
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://media.hcdn.vn//hsk/brandLa-bonita-banner-brand-1320x250---1102020251739263923_img_1320x250_c0e985_fit_center.jpg" alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://media.hcdn.vn/hsk/1740727286home-hangmoi2802.jpg" alt="" style={{overflow:"hidden", width:"100%", height:"100%"}}/>
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://media.hcdn.vn/hsk/1740800974homelancome0103.jpg" alt="" style={{overflow:"hidden", width:"100%", height:"100%"}}/>
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://media.hcdn.vn/hsk/1740727813homeclk2802.jpg" alt="" style={{overflow:"hidden", width:"100%", height:"100%"}}/>
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://media.hcdn.vn/hsk/1741681982homeobagi1103.png" alt="" style={{overflow:"hidden", width:"100%", height:"100%"}}/>
      </SwiperSlide>
    </Swiper>
  );
}