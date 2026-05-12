import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { Plus, Trash2, Search, X, BookOpen } from 'lucide-react-native';
import apiService from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const AdminBooksScreen = () => {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({ title:'', author:'', isbn:'', category:'', rating:'', pages:'', description:'', cover_url:'' });

  const fetchBooks = useCallback(async () => {
    try { const d = await apiService.getBooks(); setBooks(d); setFiltered(d); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => {
    if (!searchQuery.trim()) { setFiltered(books); return; }
    const q = searchQuery.toLowerCase();
    setFiltered(books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)));
  }, [searchQuery, books]);

  const handleAdd = async () => {
    if (!newBook.title||!newBook.author||!newBook.isbn) { Alert.alert('Hata','Başlık, yazar, ISBN zorunlu'); return; }
    try {
      await apiService.addBook({...newBook, rating:parseFloat(newBook.rating)||0, pages:parseInt(newBook.pages)||0}, token);
      Alert.alert('Başarılı ✅','Kitap eklendi'); setShowAddModal(false);
      setNewBook({ title:'', author:'', isbn:'', category:'', rating:'', pages:'', description:'', cover_url:'' });
      fetchBooks();
    } catch(e) { Alert.alert('Hata', e.message); }
  };
  const handleDelete = (id,title) => {
    Alert.alert('Sil',`"${title}" silinsin mi?`,[
      {text:'İptal',style:'cancel'},
      {text:'Sil',style:'destructive',onPress:async()=>{
        try { await apiService.deleteBook(id,token); fetchBooks(); } catch(e){ Alert.alert('Hata',e.message); }
      }}
    ]);
  };

  if (loading) return <View style={s.ctr}><ActivityIndicator size="large" color="#1E293B"/></View>;
  return (
    <View style={s.c}>
      <View style={s.hdr}><Text style={s.ht}>Kitap Yönetimi</Text><Text style={s.hs}>{books.length} kitap</Text></View>
      <View style={s.tb}>
        <View style={s.sb}><Search size={18} color="#64748B"/>
          <TextInput style={s.si} placeholder="Ara..." placeholderTextColor="#94A3B8" value={searchQuery} onChangeText={setSearchQuery}/>
          {searchQuery.length>0&&<TouchableOpacity onPress={()=>setSearchQuery('')}><X size={18} color="#94A3B8"/></TouchableOpacity>}
        </View>
        <TouchableOpacity style={s.ab} onPress={()=>setShowAddModal(true)}><Plus size={22} color="#FFF"/></TouchableOpacity>
      </View>
      <FlatList data={filtered} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:30}}
        renderItem={({item})=>(
          <View style={s.bc}>
            <View style={[s.dot,{backgroundColor:item.available?'#10B981':'#EF4444'}]}/>
            <View style={{flex:1}}>
              <Text style={s.bt} numberOfLines={1}>{item.title}</Text>
              <Text style={s.bs}>{item.author} • {item.category}</Text>
            </View>
            <TouchableOpacity style={{padding:10}} onPress={()=>handleDelete(item.id,item.title)}><Trash2 size={18} color="#EF4444"/></TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<View style={{alignItems:'center',padding:48}}><BookOpen size={32} color="#94A3B8"/><Text style={{color:'#94A3B8',marginTop:8}}>Kitap yok</Text></View>}
      />
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={s.mo}><View style={s.mc}>
          <View style={s.mh}><Text style={s.mt}>Yeni Kitap</Text><TouchableOpacity onPress={()=>setShowAddModal(false)}><X size={24} color="#1E293B"/></TouchableOpacity></View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {[{k:'title',l:'Başlık *'},{k:'author',l:'Yazar *'},{k:'isbn',l:'ISBN *'},{k:'category',l:'Kategori'},{k:'rating',l:'Puan',kb:'numeric'},{k:'pages',l:'Sayfa',kb:'numeric'},{k:'description',l:'Açıklama',ml:true},{k:'cover_url',l:'Kapak URL'}].map(f=>(
              <View key={f.k} style={{marginBottom:14}}>
                <Text style={{fontSize:13,fontWeight:'500',color:'#64748B',marginBottom:6}}>{f.l}</Text>
                <TextInput style={[s.fi,f.ml&&{height:80,textAlignVertical:'top'}]} placeholder={f.l} placeholderTextColor="#94A3B8"
                  value={newBook[f.k]} onChangeText={t=>setNewBook(p=>({...p,[f.k]:t}))} keyboardType={f.kb||'default'} multiline={f.ml}/>
              </View>
            ))}
            <TouchableOpacity style={s.sub} onPress={handleAdd}><Text style={{color:'#FFF',fontSize:16,fontWeight:'600'}}>Ekle</Text></TouchableOpacity>
            <View style={{height:40}}/>
          </ScrollView>
        </View></View>
      </Modal>
    </View>
  );
};
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:'#F1F5F9'},ctr:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#F1F5F9'},
  hdr:{backgroundColor:'#1E293B',paddingHorizontal:24,paddingTop:48,paddingBottom:20},
  ht:{fontSize:24,fontWeight:'bold',color:'#FFF'},hs:{fontSize:13,color:'#94A3B8',marginTop:4},
  tb:{flexDirection:'row',paddingHorizontal:16,marginVertical:10},
  sb:{flex:1,flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',borderRadius:10,paddingHorizontal:12,borderWidth:1,borderColor:'#E2E8F0',marginRight:10},
  si:{flex:1,height:44,fontSize:14,color:'#1E293B',marginLeft:8},
  ab:{width:44,height:44,borderRadius:10,backgroundColor:'#3B82F6',alignItems:'center',justifyContent:'center'},
  bc:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',borderRadius:10,padding:14,marginBottom:8,borderWidth:1,borderColor:'#E2E8F0'},
  dot:{width:8,height:8,borderRadius:4,marginRight:12},
  bt:{fontSize:15,fontWeight:'600',color:'#1E293B'},bs:{fontSize:13,color:'#64748B',marginTop:2},
  mo:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'},
  mc:{backgroundColor:'#FFF',borderTopLeftRadius:24,borderTopRightRadius:24,paddingHorizontal:24,paddingTop:20,maxHeight:'85%'},
  mh:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20},
  mt:{fontSize:20,fontWeight:'600',color:'#1E293B'},
  fi:{backgroundColor:'#F8FAFC',borderRadius:10,borderWidth:1,borderColor:'#E2E8F0',paddingHorizontal:14,paddingVertical:12,fontSize:15,color:'#1E293B'},
  sub:{backgroundColor:'#3B82F6',borderRadius:12,padding:16,alignItems:'center',marginTop:8},
});
export default AdminBooksScreen;
