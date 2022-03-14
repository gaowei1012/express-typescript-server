let cosHost: string = '';
if (process.env.NODE_ENV === 'docker') {
  cosHost = 'cos-service:4003';
} else if (process.env.NODE_ENV === 'dev') {
  cosHost = '127.0.0.1:4003';
} else {
  cosHost = '127.0.0.1:4003';
}

export default {
  bucket: 'bzy-project-1301420635',
  region: 'ap-nanjing',
  Tecent_COS_Domain: 'https://bzy-project-1301420635.cos.ap-nanjing.myqcloud.com',
  previewImageSizeLimit: 1048576,
  contentImageSizeLimit: 5242880,
  cosHost: cosHost,
};
