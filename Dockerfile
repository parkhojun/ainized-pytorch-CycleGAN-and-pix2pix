FROM taesungp/pytorch-cyclegan-and-pix2pix

CMD ["bash"]


WORKDIR /workspace
RUN rm -rf pytorch-CycleGAN-and-pix2pix
RUN apt-get update
RUN apt-get -y install vim
RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -
RUN apt-get -y install nodejs
RUN git clone https://github.com/parkhojun/ainized-pytorch-CycleGAN-and-pix2pix.git
WORKDIR /workspace/ainized-pytorch-CycleGAN-and-pix2pix
RUN bash ./datasets/download_cyclegan_dataset.sh maps
RUN bash ./scripts/download_cyclegan_model.sh apple2orange
RUN bash ./scripts/download_cyclegan_model.sh summer2winter_yosemite
RUN bash ./scripts/download_cyclegan_model.sh horse2zebra
RUN bash ./scripts/download_cyclegan_model.sh monet2photo
RUN bash ./scripts/download_cyclegan_model.sh iphone2dslr_flower
#RUN bash ./datasets/download_cyclegan_dataset.sh apple2orange
#RUN bash ./datasets/download_cyclegan_dataset.sh summer2winter_yosemite
#RUN bash ./datasets/download_cyclegan_dataset.sh horse2zebra
#RUN bash ./datasets/download_cyclegan_dataset.sh monet2photo
#RUN bash ./datasets/download_cyclegan_dataset.sh facades
#RUN bash ./datasets/download_cyclegan_dataset.sh iphone2dslr_flower

RUN bash ./scripts/download_pix2pix_model.sh facades_label2photo
RUN bash ./scripts/download_pix2pix_model.sh edges2shoes
RUN bash ./scripts/download_pix2pix_model.sh sat2map
RUN bash ./scripts/download_pix2pix_model.sh map2sat
RUN bash ./scripts/download_pix2pix_model.sh day2night
#RUN bash ./datasets/download_pix2pix_dataset.sh facades
#RUN bash ./datasets/download_pix2pix_dataset.sh cityscapes
#RUN bash ./datasets/download_pix2pix_dataset.sh night2day
#RUN bash ./datasets/download_pix2pix_dataset.sh edges2shoes
#RUN bash ./datasets/download_pix2pix_dataset.sh maps

RUN rm -rf node_modules && npm install

COPY package.json .
RUN npm install
RUN npm install sync-exec

COPY . .
EXPOSE 80
ENTRYPOINT npm start

